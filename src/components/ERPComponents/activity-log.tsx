export function ActivityLog() {
    const activities = [
      { date: '2023-06-01', action: 'Customer created' },
      { date: '2023-06-15', action: 'Invoice #INV-001 sent' },
      { date: '2023-06-30', action: 'Payment received for Invoice #INV-001' },
    ]
  
    return (
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="text-sm text-muted-foreground">{activity.date}</div>
            <div>{activity.action}</div>
          </div>
        ))}
      </div>
    )
  }
  
  