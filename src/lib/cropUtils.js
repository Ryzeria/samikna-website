export const getStatusColor = (status) => {
  const colors = {
    completed: 'bg-green-100 text-green-800 border-green-200',
    active: 'bg-blue-100 text-blue-800 border-blue-200',
    scheduled: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    urgent: 'bg-red-100 text-red-800 border-red-200',
    ready_harvest: 'bg-purple-100 text-purple-800 border-purple-200',
    ongoing: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    planned: 'bg-gray-100 text-gray-800 border-gray-200',
  };
  return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
};

export const getPriorityColor = (priority) => {
  const colors = {
    urgent: 'bg-red-500',
    high: 'bg-orange-500',
    normal: 'bg-blue-500',
    low: 'bg-gray-500',
  };
  return colors[priority] || 'bg-gray-500';
};

export const formatCurrency = (amount) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount || 0);

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
