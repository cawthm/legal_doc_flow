'use client'

import { useState, useEffect, Dispatch, SetStateAction } from 'react'
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

export function SubscriptionFlowModal({ setAnswers }: { setAnswers: Dispatch<SetStateAction<string[]>> }) {
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
  const [qualifiedClientRepresentations, setQualifiedClientRepresentations] = useState({
    rep1: { initialed: false, initials: '' },
    rep2: { initialed: false, initials: '' },
    rep3: { initialed: false, initials: '' },
  })
  const [userInitials, setUserInitials] = useState('')

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
    setCurrentStep('initials')
  }

  const handleInitialsSubmit = () => {
    if (userInitials) {
      setCurrentStep('qualifiedClient')
    }
  }

  const handleQualifiedClientSubmit = () => {
    console.log('Qualified client form submitted:', qualifiedClientRepresentations)
    setOpen(false)
    
    // Update the answers in the parent component
    setAnswers([
      signatories[0].name,
      bankFormData.accountHolderName,
      bankFormData.accountNumber,
      consent ? "Yes, I consent to receive documents electronically" : "No consent given",
      Object.entries(accreditedStatus)
        .filter(([_, value]) => value)
        .map(([key, _]) => key)
        .join(", "),
      Object.entries(qualifiedClientRepresentations)
        .filter(([_, value]) => value.initialed)
        .map(([key, value]) => `${key}: ${value.initials}`)
        .join(", ")
    ])
  }

  const handleQualifiedClientChange = (key: keyof typeof qualifiedClientRepresentations, action: 'initial' | 'remove') => {
    setQualifiedClientRepresentations(prev => ({
      ...prev,
      [key]: {
        initialed: action === 'initial',
        initials: action === 'initial' ? userInitials : '',
      }
    }))
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

  const handleBack = () => {
    switch (currentStep) {
      case 'bank':
        setCurrentStep('consent');
        break;
      case 'accredited':
        setCurrentStep('bank');
        break;
      case 'initials':
        setCurrentStep('accredited');
        break;
      case 'qualifiedClient':
        setCurrentStep('initials');
        break;
      default:
        break;
    }
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
      <DialogFooter className="flex justify-between">
        <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
        <Button onClick={handleConsentSubmit}>Next</Button>
      </DialogFooter>
    </>
  )

  // Render the bank account form
  const renderBankForm = () => (
    <ScrollArea className="h-[400px] pr-4">
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
        <DialogFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={handleBack}>Back</Button>
          <Button type="submit">Next</Button>
        </DialogFooter>
      </form>
    </ScrollArea>
  )

  const renderInitialsForm = () => (
    <div className="space-y-4">
      <p>Some portions of the document will ask for your initials to complete. Please provide your initials below.</p>
      <div className="flex items-center space-x-4">
        <div>
          <Label htmlFor="userInitials">Your Initials</Label>
          <Input
            id="userInitials"
            value={userInitials}
            onChange={(e) => setUserInitials(e.target.value)}
            placeholder="Type your initials"
            className="w-24"
          />
        </div>
        {userInitials && (
          <div className="font-signature text-4xl text-blue-600">
            {userInitials}
          </div>
        )}
      </div>
      <DialogFooter className="flex justify-between">
        <Button type="button" variant="outline" onClick={handleBack}>Back</Button>
        <Button onClick={handleInitialsSubmit} disabled={!userInitials}>Next</Button>
      </DialogFooter>
    </div>
  )

  const renderQualifiedClientForm = () => (
    <ScrollArea className="h-[400px] pr-4">
      <form onSubmit={(e) => { e.preventDefault(); handleQualifiedClientSubmit(); }} className="space-y-4">
        <div className="space-y-4">
          <div className="space-y-4">
            <div>
              <Label>
                I represent that I have a net worth of more than $2,100,000 (excluding primary residence).
              </Label>
              <InitialInput
                id="rep1"
                isInitialed={qualifiedClientRepresentations.rep1.initialed}
                onInitial={() => handleQualifiedClientChange('rep1', 'initial')}
                onRemove={() => handleQualifiedClientChange('rep1', 'remove')}
              />
            </div>
            <div>
              <Label>
                I represent that I have at least $1,000,000 under management with the investment adviser.
              </Label>
              <InitialInput
                id="rep2"
                isInitialed={qualifiedClientRepresentations.rep2.initialed}
                onInitial={() => handleQualifiedClientChange('rep2', 'initial')}
                onRemove={() => handleQualifiedClientChange('rep2', 'remove')}
              />
            </div>
            <div>
              <Label>
                I represent that I am a qualified purchaser as defined in section 2(a)(51)(A) of the Investment Company Act of 1940.
              </Label>
              <InitialInput
                id="rep3"
                isInitialed={qualifiedClientRepresentations.rep3.initialed}
                onInitial={() => handleQualifiedClientChange('rep3', 'initial')}
                onRemove={() => handleQualifiedClientChange('rep3', 'remove')}
              />
            </div>
          </div>
        </div>
        <DialogFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={handleBack}>Back</Button>
          <Button type="submit">Submit</Button>
        </DialogFooter>
      </form>
    </ScrollArea>
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
        <DialogFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={handleBack}>Back</Button>
          <Button type="submit">Next</Button>
        </DialogFooter>
      </form>
    </ScrollArea>
  )

  const InitialInput = ({ 
    id, 
    isInitialed, 
    onInitial, 
    onRemove 
  }: { 
    id: string, 
    isInitialed: boolean, 
    onInitial: () => void, 
    onRemove: () => void 
  }) => (
    <div className="flex items-center space-x-2">
      <Button
        onClick={isInitialed ? onRemove : onInitial}
        variant={isInitialed ? "destructive" : "default"}
      >
        {isInitialed ? "Remove" : "Initial"}
      </Button>
      {isInitialed && (
        <span className="font-signature text-2xl">{userInitials}</span>
      )}
    </div>
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
             currentStep === 'accredited' ? 'Accredited Investor Status' :
             currentStep === 'initials' ? 'Provide Your Initials' :
             'Qualified Client Status'}
          </DialogTitle>
          <DialogDescription>
            {currentStep === 'consent' ? 'Please provide your consent and list the authorized signatories for the fund.' : 
             currentStep === 'bank' ? 'Please provide your bank account information.' :
             currentStep === 'accredited' ? 'Please indicate which of the following accredited investor criteria apply to you.' :
             currentStep === 'initials' ? 'Please provide your initials for document completion.' :
             'Please initial the following representations if they apply to you.'}
          </DialogDescription>
        </DialogHeader>
        {currentStep === 'consent' ? renderConsentForm() : 
         currentStep === 'bank' ? renderBankForm() : 
         currentStep === 'accredited' ? renderAccreditedForm() :
         currentStep === 'initials' ? renderInitialsForm() :
         renderQualifiedClientForm()}
        {showWarning && (
          <div className="text-red-500 mt-2">
            Please complete all required fields and provide consent.
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}