'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { BankAccountModalComponent } from "./bank-account-modal"

export function ConsentModalComponent() {
  const [open, setOpen] = useState(false)
  const [consent, setConsent] = useState(false)
  const [signatories, setSignatories] = useState([{ name: '', title: '' }])
  const [showWarning, setShowWarning] = useState(false)
  const [showBankModal, setShowBankModal] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [currentStep, setCurrentStep] = useState('consent') // 'consent' or 'bank'

  useEffect(() => {
    console.log("Current step:", currentStep)
    console.log("Show bank modal:", showBankModal)
  }, [currentStep, showBankModal])

  useEffect(() => {
    // Check if the user has started filling out the form
    if (consent || signatories.some(s => s.name || s.title)) {
      setHasStarted(true)
    }
  }, [consent, signatories])

  const addSignatory = () => {
    setSignatories([...signatories, { name: '', title: '' }])
  }

  const updateSignatory = (index: number, field: 'name' | 'title', value: string) => {
    const updatedSignatories = signatories.map((signatory, i) => {
      if (i === index) {
        return { ...signatory, [field]: value }
      }
      return signatory
    })
    setSignatories(updatedSignatories)
  }

  const handleSubmit = () => {
    if (!consent) {
      setShowWarning(true)
      return
    }
    if (signatories.some(s => !s.name)) {
      setShowWarning(true)
      return
    }
    console.log('Consent form submitted:', { consent, signatories })
    setOpen(false)
    setShowWarning(false)
    setCurrentStep('bank')
    setShowBankModal(true)
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setShowWarning(false)
    }
  }

  const handleBankModalClose = () => {
    console.log("Bank modal closed. Current step:", currentStep)
    setShowBankModal(false)
  }

  const handleBeginResume = () => {
    console.log("Begin/Resume clicked. Current step:", currentStep)
    if (currentStep === 'bank') {
      setShowBankModal(true)
    } else {
      setOpen(true)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button 
            onClick={handleBeginResume}
            className={hasStarted ? "bg-green-500 hover:bg-green-600" : ""}
          >
            {hasStarted ? "Resume" : "Begin"}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[625px] bg-white">
          <DialogHeader>
            <DialogTitle>Consent and Authorized Signatories</DialogTitle>
            <DialogDescription>
              Please provide your consent and list the authorized signatories for the fund.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="consent"
                checked={consent}
                onCheckedChange={(checked) => setConsent(checked as boolean)}
              />
              <Label htmlFor="consent">
                I consent to receive documents electronically
              </Label>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium">Authorized Signatories</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Title (Optional)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {signatories.map((signatory, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Input
                          value={signatory.name}
                          onChange={(e) => updateSignatory(index, 'name', e.target.value)}
                          placeholder="Enter name"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={signatory.title}
                          onChange={(e) => updateSignatory(index, 'title', e.target.value)}
                          placeholder="Enter title (optional)"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button onClick={addSignatory} variant="outline">
                Add Signatory
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmit}>Submit</Button>
          </DialogFooter>
          {showWarning && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-4 rounded shadow-lg">
                <p className="text-red-500">Please complete all required fields and provide consent.</p>
                <Button onClick={() => setShowWarning(false)} className="mt-2">Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {showBankModal && (
        <BankAccountModalComponent 
          onClose={handleBankModalClose}
          onComplete={() => {
            setHasStarted(true)
            setShowBankModal(false)
            console.log("Bank account form completed. Current step:", currentStep)
          }}
        />
      )}
    </>
  )
}