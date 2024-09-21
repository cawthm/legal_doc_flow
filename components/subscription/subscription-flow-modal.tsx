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
import { ScrollArea } from "@/components/ui/scroll-area"

export function SubscriptionFlowModal() {
  // =========================================
  // State Declarations
  // =========================================
  const [open, setOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState('consent')
  const [consent, setConsent] = useState(false)
  const [signatories, setSignatories] = useState([{ name: '', title: '' }])
  const [showWarning, setShowWarning] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [bankFormData, setBankFormData] = useState({
    bankName: '',
    accountHolderName: '',
    accountNumber: '',
    routingNumber: '',
  })
  const [accreditedStatus, setAccreditedStatus] = useState({
    income: false,
    netWorth: false,
    seriesExams: false,
    businessOwner: false,
    executive: false,
    investmentProfessional: false,
  })

  // =========================================
  // Effect Hooks
  // =========================================
  
  // Log current step whenever it changes
  useEffect(() => {
    console.log("Current step:", currentStep)
  }, [currentStep])

  // Check if user has started filling out any form
  useEffect(() => {
    if (consent || signatories.some(s => s.name || s.title) || Object.values(bankFormData).some(v => v)) {
      setHasStarted(true)
    }
  }, [consent, signatories, bankFormData])

  // =========================================
  // Event Handlers
  // =========================================
  
  // Handle submission of consent form
  const handleConsentSubmit = () => {
    if (!consent || signatories.some(s => !s.name)) {
      setShowWarning(true)
      return
    }
    setShowWarning(false)
    setCurrentStep('bank')
  }

  // Handle submission of bank account form
  const handleBankSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Bank account form submitted:', bankFormData)
    setCurrentStep('accredited')
  }

  const handleAccreditedSubmit = () => {
    console.log('Accredited investor form submitted:', accreditedStatus)
    setOpen(false)
    // Here you would typically send all the collected data to your backend
  }

  const handleAccreditedStatusChange = (key: keyof typeof accreditedStatus) => {
    setAccreditedStatus(prev => ({ ...prev, [key]: !prev[key] }))
  }

  // Add a new signatory to the list
  const addSignatory = () => {
    setSignatories([...signatories, { name: '', title: '' }])
  }

  // Update a specific signatory's information
  const updateSignatory = (index: number, field: 'name' | 'title', value: string) => {
    const updatedSignatories = signatories.map((signatory, i) => {
      if (i === index) {
        return { ...signatory, [field]: value }
      }
      return signatory
    })
    setSignatories(updatedSignatories)
  }

  // Handle changes in the bank form inputs
  const handleBankFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setBankFormData(prevData => ({ ...prevData, [name]: value }))
  }

  // =========================================
  // Render Functions
  // =========================================
  
  // Render the consent form
  const renderConsentForm = () => (
    <>
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
        <Button onClick={handleConsentSubmit}>Next</Button>
      </DialogFooter>
    </>
  )

  // Render the bank account form
  const renderBankForm = () => (
    <form onSubmit={handleBankSubmit} className="space-y-4">
      <div>
        <Label htmlFor="bankName">Bank Name</Label>
        <Input
          id="bankName"
          name="bankName"
          value={bankFormData.bankName}
          onChange={handleBankFormChange}
          required
        />
      </div>
     
      <div>
        <Label htmlFor="accountHolderName">Account Holder Name (If different from above LP signatory)</Label>
        <Input
          id="accountHolderName"
          name="accountHolderName"
          value={bankFormData.accountHolderName}
          onChange={handleBankFormChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="accountNumber">Account Number</Label>
        <Input
          id="accountNumber"
          name="accountNumber"
          value={bankFormData.accountNumber}
          onChange={handleBankFormChange}
          required
        />
      </div>
      <div>
        <Label htmlFor="routingNumber">Routing Number</Label>
        <Input
          id="routingNumber"
          name="routingNumber"
          value={bankFormData.routingNumber}
          onChange={handleBankFormChange}
          required
        />
      </div>
      <DialogFooter>
        <Button type="submit">Submit</Button>
      </DialogFooter>
    </form>
  )

  const renderAccreditedForm = () => (
    <ScrollArea className="h-[400px] pr-4">
      <form onSubmit={(e) => { e.preventDefault(); handleAccreditedSubmit(); }} className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="income"
              checked={accreditedStatus.income}
              onCheckedChange={() => handleAccreditedStatusChange('income')}
            />
            <Label htmlFor="income">
              Individual income exceeding $200,000 in each of the two most recent years or joint income with a spouse or spouse equivalent exceeding $300,000 for those years and a reasonable expectation of the same income level in the current year.
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="netWorth"
              checked={accreditedStatus.netWorth}
              onCheckedChange={() => handleAccreditedStatusChange('netWorth')}
            />
            <Label htmlFor="netWorth">
              Net worth over $1 million, either alone or together with a spouse or spouse equivalent (excluding the value of the person's primary residence).
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="seriesExams"
              checked={accreditedStatus.seriesExams}
              onCheckedChange={() => handleAccreditedStatusChange('seriesExams')}
            />
            <Label htmlFor="seriesExams">
              Hold in good standing one or more professional certifications or designations or credentials from an accredited educational institution that the SEC has designated as qualifying an individual for accredited investor status.
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="businessOwner"
              checked={accreditedStatus.businessOwner}
              onCheckedChange={() => handleAccreditedStatusChange('businessOwner')}
            />
            <Label htmlFor="businessOwner">
              Any entity in which all of the equity owners are accredited investors.
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="executive"
              checked={accreditedStatus.executive}
              onCheckedChange={() => handleAccreditedStatusChange('executive')}
            />
            <Label htmlFor="executive">
              Executive officer, director, trustee, general partner, advisory board member, or person serving in a similar capacity, of the offering company or general partner of the offering company.
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="investmentProfessional"
              checked={accreditedStatus.investmentProfessional}
              onCheckedChange={() => handleAccreditedStatusChange('investmentProfessional')}
            />
            <Label htmlFor="investmentProfessional">
              Investment professional: Person who demonstrates the professional knowledge of unregistered securities by passing certain FINRA administered exams.
            </Label>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Submit</Button>
        </DialogFooter>
      </form>
    </ScrollArea>
  )

  // =========================================
  // Main Render
  // =========================================
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          onClick={() => setOpen(true)}
          className={hasStarted ? "bg-green-500 hover:bg-green-600" : ""}
        >
          {hasStarted ? "Resume" : "Begin"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px] bg-white">
        <DialogHeader>
          <DialogTitle>
            {currentStep === 'consent' ? 'Consent and Authorized Signatories' : 
             currentStep === 'bank' ? 'Bank Account Information' : 
             'Accredited Investor Status'}
          </DialogTitle>
          <DialogDescription>
            {currentStep === 'consent' ? 'Please provide your consent and list the authorized signatories for the fund.' : 
             currentStep === 'bank' ? 'Please provide your bank account information.' :
             'Please indicate which of the following accredited investor criteria apply to you.'}
          </DialogDescription>
        </DialogHeader>
        {currentStep === 'consent' ? renderConsentForm() : 
         currentStep === 'bank' ? renderBankForm() : 
         renderAccreditedForm()}
        {showWarning && (
          <div className="text-red-500 mt-2">
            Please complete all required fields and provide consent.
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}