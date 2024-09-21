"use client"

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function BankAccountModalComponent({ 
  onClose,
  onComplete
}: { 
  onClose: () => void;
  onComplete: () => void;
}) {
  const [formData, setFormData] = useState({
    bankName: '',
    bankAddress: '',
    accountHolderName: '',
    accountNumber: '',
    routingNumber: '',
    swiftCode: '',
  })

  useEffect(() => {
    console.log("BankAccountModal rendered")
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prevData => ({ ...prevData, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Bank account form submitted:', formData)
    onComplete() // Call this when the bank account form is successfully submitted
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-semibold">Bank Account Information</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="bankName">Bank Name</Label>
              <Input
                id="bankName"
                name="bankName"
                value={formData.bankName}
                onChange={handleChange}
                required
              />
            </div>
            {/* Add other form fields here */}
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </div>
    </div>
  )
}