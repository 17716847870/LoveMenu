"use client";

import { useState, useMemo } from "react";
import { FoodRequest } from "@/types";
import PageHeader from "@/components/admin/shared/PageHeader";
import { PageContainer } from "@/components/ui/PageContainer";
import RequestFilterBar from "@/components/admin/requests/RequestFilterBar";
import MobileRequestFilterBar from "@/components/admin/requests/MobileRequestFilterBar";
import RequestDataTable from "@/components/admin/requests/RequestDataTable";
import MobileRequestListView from "@/components/admin/requests/MobileRequestListView";
import LovePagination from "@/components/admin/ui/LovePagination/LovePagination";

// Mock Data
const initialRequests: FoodRequest[] = [
  {
    id: "req-001",
    name: "韩式炸鸡",
    description: "很想吃甜辣口味的韩式炸鸡，配上腌萝卜",
    status: "pending",
    createdAt: "2024-03-16",
    image: "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=200&auto=format&fit=crop&q=60"
  },
  {
    id: "req-002",
    name: "抹茶千层",
    description: "下午茶想吃这个，稍微苦一点的那种",
    status: "approved",
    createdAt: "2024-03-15",
    image: "https://images.unsplash.com/photo-1579306194872-64d3b7bac4c2?w=200&auto=format&fit=crop&q=60"
  },
  {
    id: "req-003",
    name: "螺蛳粉",
    description: "偶尔也想吃点重口味的嘛",
    status: "rejected",
    createdAt: "2024-03-14",
  }
];

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<FoodRequest[]>(initialRequests);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleApprove = (id: string) => {
    setRequests(prev => prev.map(req => req.id === id ? { ...req, status: 'approved' } : req));
  };

  const handleReject = (id: string) => {
    setRequests(prev => prev.map(req => req.id === id ? { ...req, status: 'rejected' } : req));
  };

  const handleDelete = (id: string) => {
    setRequests(prev => prev.filter(req => req.id !== id));
  };

  const processedData = useMemo(() => {
    return requests.filter(req => 
      (req.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
       req.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterStatus === "all" || req.status === filterStatus)
    );
  }, [requests, searchTerm, filterStatus]);

  const totalItems = processedData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const validCurrentPage = Math.max(1, Math.min(currentPage, totalPages > 0 ? totalPages : 1));
  
  const currentData = processedData.slice(
    (validCurrentPage - 1) * pageSize, 
    validCurrentPage * pageSize
  );

  return (
    <PageContainer>
      <div className="mx-auto pb-20 md:pb-0">
        <PageHeader title="食物请求" subtitle="处理用户的点餐心愿" />

        <div className="hidden md:block">
          <RequestFilterBar 
            onSearch={(term) => {
              setSearchTerm(term);
              setCurrentPage(1);
            }}
            onStatusChange={(val) => {
              setFilterStatus(val);
              setCurrentPage(1);
            }}
            onReset={() => {
              setSearchTerm("");
              setFilterStatus("all");
              setCurrentPage(1);
            }}
          />
        </div>

        <MobileRequestFilterBar 
          onSearch={(term) => {
            setSearchTerm(term);
            setCurrentPage(1);
          }}
          onStatusChange={(val) => {
            setFilterStatus(val);
            setCurrentPage(1);
          }}
        />

        <div className="hidden md:block">
          <RequestDataTable 
            data={currentData}
            onApprove={handleApprove}
            onReject={handleReject}
            onDelete={handleDelete}
          />
        </div>

        <MobileRequestListView 
          data={currentData}
          onApprove={handleApprove}
          onReject={handleReject}
          onDelete={handleDelete}
        />

        <LovePagination 
          total={totalItems}
          page={currentPage}
          pageSize={pageSize}
          pageSizeOptions={[5, 10, 20, 50]}
          onPageChange={setCurrentPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setCurrentPage(1);
          }}
        />
      </div>
    </PageContainer>
  );
}
