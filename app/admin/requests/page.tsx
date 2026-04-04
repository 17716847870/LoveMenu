"use client";

import { useState, useMemo, useEffect } from "react";
import { useMessage } from "@/components/ui/Message";
import { FoodRequest } from "@/types";
import PageHeader from "@/components/admin/shared/PageHeader";
import { PageContainer } from "@/components/ui/PageContainer";
import RequestFilterBar from "@/components/admin/requests/RequestFilterBar";
import MobileRequestFilterBar from "@/components/admin/requests/MobileRequestFilterBar";
import RequestDataTable from "@/components/admin/requests/RequestDataTable";
import MobileRequestListView from "@/components/admin/requests/MobileRequestListView";
import LovePagination from "@/components/admin/ui/LovePagination/LovePagination";

export default function AdminRequestsPage() {
  const message = useMessage();
  const [requests, setRequests] = useState<FoodRequest[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/requests');
      const data = await res.json();
      if (data.data) setRequests(data.data);
    } catch (error) {
      console.error('Failed to fetch requests');
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await fetch(`/api/requests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      fetchRequests();
    } catch (error) {
      message.error('更新状态失败');
    }
  };

  const handleApprove = (id: string) => handleUpdateStatus(id, 'approved');
  const handleReject = (id: string) => handleUpdateStatus(id, 'rejected');

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/requests/${id}`, { method: 'DELETE' });
      fetchRequests();
    } catch (error) {
      message.error('删除失败');
    }
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
