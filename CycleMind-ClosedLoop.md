# CycleMind 闭环版设计文档

## 1. 目标

本方案的目标不是直接让 AI 从零开始预测姨妈周期，而是采用 **“系统规则计算基础值 + AI 基于影响因素做有限修正”** 的闭环方式，提升结果的稳定性、可解释性与可控性。

核心原则：

1. **基础值必须由系统先算**，不能交给 AI 自由发挥。
2. **AI 只负责修正，不负责重算底层规则。**
3. **所有修正必须落在可控范围内**，并能解释原因。
4. **最终输出必须前后一致**，不能出现字段互相矛盾。
5. **该系统用于合理推测，不用于医学诊断。**

---

## 2. 总体闭环架构

整个流程分为 5 个阶段：

### 阶段 A：输入收集
系统收集用户原始数据，包括：

- 历史月经记录
- 周期长度
- 经期长度
- 年龄
- 规律程度
- 压力/睡眠/饮食/运动/旅行等影响因素
- 性行为 / 避孕 / 怀孕风险
- 症状 / 激素药物 / 妇科病史

### 阶段 B：系统内部规则计算基础值
系统不调用 AI，直接通过规则引擎先算出：

- `base_cycle`
- `base_next_date`
- `base_ovulation_date`
- `base_fertile_window`
- `cycle_stability`
- `data_quality`
- `base_confidence`
- `base_status`
- `base_alerts`

### 阶段 C：AI 基于影响因素做“有限修正”
AI 不重算基础值，只基于：

- 系统算好的基础结果
- 近期影响因素
- 特殊情况
- 风险因素

输出一个受控修正结果：

- `adjustment`
- `status`
- `confidence`
- `key_factors`
- `alerts`
- `reason`

其中 `adjustment` 只能在 `-5 ~ +7` 天内。

### 阶段 D：系统二次合成最终结果
系统拿 AI 返回值后，自己再计算：

- `final_cycle = base_cycle + adjustment`
- `predicted_next_date = last_period_date + final_cycle`

并对最终结果做一致性校验。

### 阶段 E：校验与兜底
如果 AI 输出不合法、缺字段、逻辑矛盾，则系统回退到规则基础值，保证系统稳定。

---

## 3. 输入层设计

## 3.1 原始输入字段

### 字段总览表

| 字段名 | 类型 | 含义 | 是否必填 | 取值范围 / 格式 | 说明 |
| --- | --- | --- | --- | --- | --- |
| `age` | number | 用户年龄 | 否 | 通常 `12 ~ 55` | 用于辅助判断，但不单独决定结果 |
| `is_regular` | boolean | 用户是否长期规律 | 否 | `true / false` | 表示用户对自身周期规律性的主观描述 |
| `avg_cycle` | number | 平均周期天数 | 否 | 通常 `20 ~ 45` | 可由系统计算，也可由历史数据汇总得出 |
| `cycles` | number[] | 最近若干次周期长度列表 | 建议必填 | 每项通常 `20 ~ 45` | 例如 `[28, 30, 29, 31]`，是最重要的历史依据 |
| `std_cycle` | number | 周期标准差 | 否 | 通常 `0 ~ 10+` | 越小表示越稳定 |
| `last_period_date` | string | 最近一次月经开始日期 | 是 | `YYYY-MM-DD` | 最终日期推算的基准字段 |
| `avg_duration` | number | 平均经期长度 | 否 | 通常 `2 ~ 10` 天 | 用于辅助理解生理节律 |
| `stress_level` | string | 最近压力水平 | 否 | `low / medium / high` | 压力越高，延迟概率通常越高 |
| `sleep` | string | 睡眠情况 | 否 | `good / normal / poor` | 睡眠差可能影响周期稳定性 |
| `stay_up_late` | boolean | 是否熬夜 | 否 | `true / false` | 反映近期作息扰动 |
| `diet_change` | string | 饮食变化程度 | 否 | `none / mild / drastic` | 剧烈饮食变化可作为干扰因素 |
| `diet_extreme` | boolean | 是否减肥或暴饮暴食 | 否 | `true / false` | 属于较强扰动因素 |
| `exercise_change` | string | 运动变化 | 否 | `none / increase / decrease` | 运动量显著变化可能影响周期 |
| `travel` | boolean | 是否有旅行或时差变化 | 否 | `true / false` | 时差可能造成短期推迟或波动 |
| `sex` | boolean | 是否有性行为 | 否 | `true / false` | 仅作风险背景，不代表异常 |
| `contraception` | string | 避孕措施 | 否 | `none / condom / pill / other` | 与怀孕风险联合判断 |
| `pregnancy_risk` | string | 是否存在怀孕风险 | 否 | `low / medium / high` | 属于风险标签，不直接等于诊断 |
| `hormone_medication` | boolean | 是否服用激素类药物 | 否 | `true / false` | 可能显著影响周期 |
| `medical_history` | string | 妇科疾病史 | 否 | `none / pcos / other` | 用于提示特殊背景 |
| `symptoms` | string[] | 明显症状列表 | 否 | 如 `[]`、`["腹痛", "异常出血"]` | 可为空数组，建议保留原始描述 |

### 用户基础数据

- `age`
- `is_regular`
- `avg_cycle`
- `cycles`
- `std_cycle`
- `last_period_date`
- `avg_duration`

### 近期影响因素

- `stress_level`
- `sleep`
- `stay_up_late`
- `diet_change`
- `diet_extreme`
- `exercise_change`
- `travel`

### 生理与特殊情况

- `sex`
- `contraception`
- `pregnancy_risk`
- `hormone_medication`
- `medical_history`
- `symptoms`

---

## 3.2 输入字段分层原则

为了避免 AI 被重复信息干扰，系统内部要区分三类输入：

### A. 原始事实
直接来自用户或记录：

- `cycles`
- `last_period_date`
- `avg_duration`
- `symptoms`
- `sex`
- `contraception`
- `travel`
- `sleep`
- `stress_level`

### B. 规则统计值
由系统通过原始事实计算：

- `avg_cycle`
- `std_cycle`
- `cycle_stability`
- `base_cycle`
- `base_next_date`

### C. 风险解释字段
由上游业务模块给出的风险标签：

- `pregnancy_risk`
- `data_quality`
- `base_confidence`

系统要优先保证：

> 原始事实 > 系统规则统计值 > AI推断

---

## 4. 系统内部规则引擎

## 4.1 有历史数据时的规则计算

### 4.1.1 周期长度
定义：

- `cycle_n = 第n次月经开始日 - 第n-1次月经开始日`

单位：天

### 4.1.2 异常值过滤
系统先过滤异常周期：

- `< 20 天` 视为异常值
- `> 45 天` 视为异常值

如果过滤后没有有效周期，则降级走“无历史数据”逻辑。

### 4.1.3 加权平均周期
只取最近 3 次有效周期：

\[
weighted\_avg = 0.5 \times 最近周期 + 0.3 \times 次近周期 + 0.2 \times 第三近周期
\]

若有效周期不足 3 次，则按已有数据等权或降级规则处理。

### 4.1.4 平均经期长度

\[
avg\_duration = 所有有效经期长度平均值
\]

### 4.1.5 稳定性（波动程度）

标准差：

\[
\sigma = \sqrt{\frac{\sum (周期 - 平均周期)^2}{n}}
\]

系统将稳定性分层：

- `σ <= 2` → 稳定
- `2 < σ <= 5` → 中等波动
- `σ > 5` → 不稳定

输出字段：

- `cycle_stability = stable | medium | unstable`

### 4.1.6 基础周期
系统输出：

- `base_cycle = round(weighted_avg)`

### 4.1.7 基础下次月经日期

\[
base\_next\_date = last\_period\_date + base\_cycle
\]

### 4.1.8 基础排卵日

\[
base\_ovulation\_date = base\_next\_date - 14
\]

### 4.1.9 基础易孕期

- `fertile_start = base_ovulation_date - 5`
- `fertile_end = base_ovulation_date + 1`

### 4.1.10 基础状态
系统根据“当前日期 vs 基础预测日期”给出规则状态：

- 当前日期 < `base_next_date - 1` → `normal`
- 当前日期在预测附近波动窗口内 → `normal`
- 当前日期 > `base_next_date` → `delayed`

如果结合历史稳定性判断可能提前，也可给出 `early` 倾向，但通常 early 主要由 AI 修正判断。

---

## 4.2 无历史数据时的规则计算

### 默认规则

- 默认周期长度：`28 天`
- 默认经期长度：`5 天`

### 若用户提供估计周期
优先采用用户提供的估计周期，否则使用默认值 `28`。

### 基础预测

- `base_cycle = estimated_cycle or 28`
- `base_next_date = last_period_date + base_cycle`
- `base_ovulation_date = base_next_date - 14`

### 默认稳定性

- 规律用户：`σ ≈ 2`
- 不规律用户：`σ ≈ 4~6`

### 默认置信度

- 无历史数据：`base_confidence = low`

---

## 4.3 数据质量规则

### 字段说明

| 字段名 | 类型 | 含义 | 取值范围 | 判定依据 |
| --- | --- | --- | --- | --- |
| `data_quality` | string | 描述当前数据是否足够支持预测 | `high / medium / low` | 根据历史记录数量、是否缺失、是否存在异常波动综合判断 |

系统需要先评估数据质量：

### high
- 有 5 次及以上有效历史周期
- 周期标准差较小
- 最近一次月经开始时间明确

### medium
- 有 2~4 次有效历史周期
- 存在少量波动

### low
- 几乎无历史数据
- 历史数据缺失严重
- 周期本身波动极大

输出字段：

- `data_quality = high | medium | low`

---

## 4.4 基础置信度规则

### 字段说明

| 字段名 | 类型 | 含义 | 取值范围 | 说明 |
| --- | --- | --- | --- | --- |
| `base_confidence` | string | 规则引擎给出的基础预测可信度 | `high / medium / low` | 是 AI 修正前的初始置信度，不是最终输出 |

系统先根据数据完整性和稳定性给一个基础置信度：

### high
- 历史记录足够
- 周期稳定
- 干扰因素少

### medium
- 数据一般
- 有一定波动
- 有少量干扰因素

### low
- 数据少
- 波动大
- 高风险因素明显

这个值不是最终值，只是 AI 的参考输入：

- `base_confidence`

---

## 4.5 基础提醒规则

### 字段说明

| 字段名 | 类型 | 含义 | 取值范围 | 说明 |
| --- | --- | --- | --- | --- |
| `base_alerts` | string[] | 系统在 AI 介入前基于硬规则生成的提醒列表 | 数组，可为空 `[]` | 例如 `possible_delay`、`pregnancy_risk`、`cycle_abnormal` |

在 AI 介入前，系统先做一轮硬规则提醒：

### 提醒触发条件

- `pregnancy_risk = high` → 加入怀孕风险提醒
- 有异常出血 / 严重腹痛等症状 → 加入症状提醒
- 周期异常值过多 → 加入周期异常提醒
- 当前日期明显晚于基础预测日期 → 加入推迟提醒

输出字段：

- `base_alerts`

---

## 5. AI 修正层设计

## 5.1 AI 的职责边界

AI **不能做的事**：

- 不能重算 `base_cycle`
- 不能自己定义基础日期
- 不能输出医疗诊断
- 不能输出超出范围的修正值
- 不能忽略系统给出的基础值

AI **可以做的事**：

- 根据影响因素判断本周期更可能提前、延迟还是基本正常
- 在 `-5 ~ +7` 范围内给出修正值
- 对 `base_confidence` 做上调或下调
- 给出最主要影响因素
- 对 `base_alerts` 做补充
- 生成一句简短解释

---

## 5.2 给 AI 的输入结构

### 系统传给 AI 的字段定义

| 字段名 | 类型 | 含义 | 取值范围 / 格式 | 说明 |
| --- | --- | --- | --- | --- |
| `base_cycle` | number | 系统规则算出的基础预测周期 | 通常 `20 ~ 45` | AI 不可重算，只能参考 |
| `base_next_date` | string | 基础预测的下次月经日期 | `YYYY-MM-DD` | AI 只能基于此做趋势判断 |
| `base_ovulation_date` | string | 基础预测的排卵日 | `YYYY-MM-DD` | 用于辅助理解当前周期阶段 |
| `cycle_stability` | string | 周期稳定性标签 | `stable / medium / unstable` | 来源于标准差分层 |
| `data_quality` | string | 数据质量等级 | `high / medium / low` | 表示当前输入信息的可靠程度 |
| `base_confidence` | string | 规则层基础置信度 | `high / medium / low` | AI 可上调或下调 |
| `base_alerts` | string[] | 规则层提醒列表 | 数组，可为空 `[]` | AI 允许补充，不应忽略 |

AI 接收的输入不应只是原始用户字段，而应是：

### A. 原始输入
- 年龄
- 是否规律
- 影响因素
- 特殊情况
- 症状

### B. 系统规则结果
- `base_cycle`
- `base_next_date`
- `base_ovulation_date`
- `cycle_stability`
- `data_quality`
- `base_confidence`
- `base_alerts`

### C. AI 约束
- `adjustment` 必须在 `-5 ~ +7`
- 不做诊断
- 不做确定性表达
- 输出必须为 JSON

---

## 5.3 AI Prompt（闭环版）

```text
你是一个女性生理周期分析助手。你的职责不是医学诊断，而是在系统规则已经完成基础计算后，根据近期影响因素做“有限修正”。

⚠️ 重要限制：
- 你不是医生
- 不要给出医疗诊断
- 不要做确定性判断，措辞必须保留不确定性
- 你不能推翻系统已经给出的基础值
- 你只能在 -5 到 +7 天范围内给出 adjustment
- 你不能重新计算 base_cycle 或 base_next_date
- 所有结论必须基于提供的数据

【原始用户信息】
- 年龄: {{age}}
- 是否长期规律: {{is_regular}}
- 最近压力水平: {{stress_level}}
- 睡眠情况: {{sleep}}
- 是否熬夜: {{stay_up_late}}
- 饮食变化: {{diet_change}}
- 是否减肥或暴饮暴食: {{diet_extreme}}
- 运动情况变化: {{exercise_change}}
- 是否旅行/时差变化: {{travel}}
- 是否有性行为: {{sex}}
- 是否有避孕措施: {{contraception}}
- 是否可能怀孕: {{pregnancy_risk}}
- 是否在服用激素类药物: {{hormone_medication}}
- 是否有妇科疾病史: {{medical_history}}
- 是否有明显症状: {{symptoms}}

【系统规则结果】
- 基础预测周期: {{base_cycle}}
- 基础预测下次月经日期: {{base_next_date}}
- 基础排卵日: {{base_ovulation_date}}
- 周期稳定性: {{cycle_stability}}
- 数据质量: {{data_quality}}
- 基础置信度: {{base_confidence}}
- 基础提醒: {{base_alerts}}

【你的任务】
你只能在系统基础预测上做有限修正：
1. 判断当前更倾向于 early / normal / delayed
2. 给出 adjustment，范围必须在 -5 到 +7
3. 给出修正后的 confidence
4. 提取最多 3 个最关键影响因素
5. 给出需要提醒的情况，可补充但不要忽略系统提醒
6. 用一句简短的话说明原因

【输出要求】
只返回 JSON：
{
  "status": "early|normal|delayed",
  "adjustment": number,
  "confidence": "low|medium|high",
  "key_factors": ["factor1", "factor2"],
  "alerts": ["alert1", "alert2"],
  "reason": "一句话说明原因（必须简短）"
}
```

---

## 6. 系统对 AI 输出的二次合成

### 最终输出字段定义

| 字段名 | 类型 | 含义 | 取值范围 / 格式 | 生成方式 |
| --- | --- | --- | --- | --- |
| `status` | string | 本周期相对基础预测的趋势判断 | `early / normal / delayed` | 由 AI 输出，系统校验 |
| `base_cycle` | number | 系统规则计算出的基础周期 | 通常 `20 ~ 45` | 系统计算 |
| `adjustment` | number | AI 给出的修正天数 | `-5 ~ +7` | AI 输出，系统校验 |
| `final_cycle` | number | 最终预测周期 | `20 ~ 45` | 系统根据 `base_cycle + adjustment` 计算并截断 |
| `base_next_date` | string | 基础预测下次月经日期 | `YYYY-MM-DD` | 系统计算 |
| `predicted_next_date` | string | 最终预测下次月经日期 | `YYYY-MM-DD` | 系统根据 `last_period_date + final_cycle` 计算 |
| `confidence` | string | 最终置信度 | `low / medium / high` | AI 输出，系统校验 |
| `key_factors` | string[] | 影响本次修正的关键因素 | 最多 3 个元素 | AI 输出，建议短标签化 |
| `alerts` | string[] | 最终提醒项 | 数组，可为空 `[]` | 系统合并 `base_alerts + ai_alerts` 去重 |
| `reason` | string | 对本次修正的简短说明 | 建议 `10 ~ 40` 字 | AI 输出，要求简短且与字段一致 |

系统不能直接信任 AI 输出，必须再做一次程序合成。

### 6.1 字段合法性校验

系统校验 AI 输出：

- `status` 是否在枚举内
- `adjustment` 是否为数字
- `adjustment` 是否在 `-5 ~ +7`
- `confidence` 是否在枚举内
- `key_factors` 是否为数组
- `alerts` 是否为数组
- `reason` 是否存在

任一不合法，则走回退策略。

### 6.2 最终周期计算

\[
final\_cycle = base\_cycle + adjustment
\]

系统限制：

- `final_cycle < 20` 时，截断为 `20`
- `final_cycle > 45` 时，截断为 `45`

### 6.3 最终日期计算

\[
predicted\_next\_date = last\_period\_date + final\_cycle
\]

### 6.4 最终提醒合并

最终提醒：

- `final_alerts = 去重(base_alerts + ai_alerts)`

### 6.5 最终结果结构

```json
{
  "status": "early|normal|delayed",
  "base_cycle": 29,
  "adjustment": 3,
  "final_cycle": 32,
  "base_next_date": "2025-04-10",
  "predicted_next_date": "2025-04-13",
  "confidence": "medium",
  "key_factors": ["high_stress", "poor_sleep"],
  "alerts": ["possible_delay"],
  "reason": "近期压力和睡眠不足可能使本次周期略有延后。"
}
```

---

## 7. 回退策略（Fallback）

当 AI 输出异常或不可用时，系统仍必须保证可返回结果。

### 回退触发条件

- AI 超时
- AI 输出非 JSON
- AI 缺少关键字段
- AI adjustment 超范围
- AI confidence 无效
- AI 结果逻辑冲突严重

### 回退结果

系统直接使用基础规则结果：

- `status = base_status`
- `adjustment = 0`
- `final_cycle = base_cycle`
- `predicted_next_date = base_next_date`
- `confidence = base_confidence`
- `alerts = base_alerts`
- `reason = "基于历史周期与规则结果进行预测。"`

---

## 8. 一致性闭环要求

### 关键字段闭环关系

| 字段 | 上游来源 | 下游用途 | 约束关系 |
| --- | --- | --- | --- |
| `last_period_date` | 原始输入 | `base_next_date`、`predicted_next_date` | 必须为最终日期推算基准 |
| `base_cycle` | 系统规则 | AI 输入、最终计算 | 不允许由 AI 覆写 |
| `adjustment` | AI 输出 | `final_cycle` | 必须在 `-5 ~ +7` |
| `final_cycle` | 系统合成 | `predicted_next_date` | 必须等于 `base_cycle + adjustment` 后再截断 |
| `base_next_date` | 系统规则 | AI 参考、fallback 输出 | 必须等于 `last_period_date + base_cycle` |
| `predicted_next_date` | 系统合成 | 最终返回 | 必须等于 `last_period_date + final_cycle` |
| `base_alerts` | 规则引擎 | 最终 `alerts` | 不应被 AI 忽略 |
| `alerts` | 系统合并 | 最终返回 | 必须由 `base_alerts + ai_alerts` 去重得到 |

为了保证系统可解释且稳定，必须满足以下闭环：

1. `base_cycle` 必须由系统规则先算出
2. `base_next_date` 必须由系统根据 `base_cycle` 算出
3. AI 只能输出 `adjustment` 和解释字段
4. `final_cycle` 必须由系统重新计算，不能直接信 AI
5. `predicted_next_date` 必须由系统重新计算，不能直接信 AI
6. `alerts` 必须由系统与 AI 合并去重
7. 当 AI 不可用时，系统必须可完全独立运行

---

## 9. 最终设计结论

这个方案本质上是：

- **规则引擎负责基础确定性计算**
- **AI 负责基于复杂上下文做有限修正**
- **系统负责最终结果合成与兜底**

也就是：

> 先由系统算“应该大概是多少”，再由 AI 判断“这次可能会偏多少”，最后再由系统生成“最终可信结果”。

这是一个相对完整、稳定、可落地的闭环方案。
