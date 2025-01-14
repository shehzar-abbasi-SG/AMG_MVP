'use client'

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { EyeIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Order, OrderStatus } from "@/context/OrdersContext"
import moment from "moment"

// const formatCurrency = (amount: string) => {
//   return new Intl.NumberFormat('en-US', {
//     style: 'currency',
//     currency: 'USD'
//   }).format(Num)
// }

// Helper function to get status badge variant
const getStatusBadgeVariant = (status: OrderStatus) => {
  switch (status) {
    case 'IN_PROGRESS':
      return 'secondary'
    case 'FULFILLED':
      return 'default'
    case 'FULFILLED':
      return 'secondary'
    case 'UNFULFILLED':
      return 'destructive'
    default:
      return 'outline'
  }
}

export function OrdersTable({orders}:{orders:Order[]}) {

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Ship To</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.name}</TableCell>
              <TableCell>{moment(order.date).format("DD/MM/YYYY")}</TableCell>
              <TableCell>{order.shipTo}</TableCell>
              <TableCell>{order.total}</TableCell>
              <TableCell>
                <Badge 
                  variant={getStatusBadgeVariant(order.status)}
                  className="capitalize"
                >
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => console.log(`View order ${order.id}`)}
                >
                  <EyeIcon className="h-4 w-4" />
                  <span className="sr-only">View order {order.id}</span>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}