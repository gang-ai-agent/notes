function Categories() {
  const categories = [
    { label: 'Category 1', detail: 'Detail 1', accent: 'bg-blue-500' },
    { label: 'Category 2', detail: 'Detail 2', accent: 'bg-green-500' },
    { label: 'Category 3', detail: 'Detail 3', accent: 'bg-red-500' },
  ]

  return (
    <div className="mt-5 flex flex-col gap-2">
      {categories.map((category) => (
        <div key={category.label} className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${category.accent}`}></div>
          <div className="text-sm font-medium">{category.label}</div>
          <div className="text-xs text-gray-500">{category.detail}</div>
        </div>
      ))}
    </div>
  )
}

export default Categories
