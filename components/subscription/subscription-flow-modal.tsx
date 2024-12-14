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
import { Kalam } from 'next/font/google'
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"
import { getSubscriptionData, saveSubscriptionData } from '@/utils/storage'

const kalam = Kalam({ 
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
})

export function SubscriptionFlowModal({ setAnswers }: { setAnswers: Dispatch<SetStateAction<string[]>> }) {
  // =========================================
  // State Declarations
  // =========================================
  const [open, setOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState('basicInfo')
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
    iraRevocabletrust: false,
    selfdirectedPlan: false,
    trustFamilyOffice: false,
    pensionEntity: false,
    accredEntity: false,
  })
  const [qualifiedClientRepresentations, setQualifiedClientRepresentations] = useState({
    rep1: { initialed: false, initials: '' },
    rep2: { initialed: false, initials: '' },
    rep3: { initialed: false, initials: '' },
    rep4: { initialed: false, initials: '' },
    rep5: { initialed: false, initials: '' },
  })
  const [userInitials, setUserInitials] = useState('')
  const [benefitPlanStatus, setBenefitPlanStatus] = useState<'notBenefitPlan' | 'benefitPlan' | null>(null)
  const [benefitPlanDetails, setBenefitPlanDetails] = useState({
    type: null as null | 'subject' | 'investing',
    planAssetPercentage: null as null | '10%' | '20%' | '30%' | '40%' | '50%' | '60%' | '70%' | '80%' | '90%' | '100%'
  })
  const [entityType, setEntityType] = useState<'individual' | 'entity' | null>(null)
  const [basicInfo, setBasicInfo] = useState({
    fullLegalName: '',
    ssn: '',
    dateOfBirth: '',
    birthPlace: '',
    citizenship: '',
    address: '',
    phoneNumber: '',
    email: '',
    stateOfFormation: '',
    dateOfFormation: '',
    isControlledPerson: false,
    authorizedSignatoryTitle: '',
    taxId: '',
  })
  const [isCompleted, setIsCompleted] = useState(false)

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

  // Improve completion check logic
  const checkAllStepsComplete = (data: any) => {
    return data?.benefitPlanStatus && 
           data?.accreditedStatus && 
           data?.qualifiedClientRepresentations && 
           Object.values(data?.qualifiedClientRepresentations).every((rep: any) => rep.initialed);
  }

  // Load saved progress on mount
  useEffect(() => {
    const savedData = getSubscriptionData()
    if (savedData) {
      setHasStarted(Boolean(savedData.currentStep))
      if (savedData.currentStep) {
        setCurrentStep(savedData.currentStep)
      }
      setIsCompleted(checkAllStepsComplete(savedData))
    }
  }, [])

  // Save progress when steps change
  useEffect(() => {
    if (hasStarted) {
      saveSubscriptionData({
        currentStep,
        // ... other data
      })
    }
  }, [currentStep, hasStarted])

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

  // Add a new function to handle skipping
  const handleSkipBankInfo = () => {
    console.log('Bank account information skipped')
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
    setCurrentStep('benefitPlan')
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
      case 'benefitPlan':
        setCurrentStep('qualifiedClient');
        break;
      default:
        break;
    }
  }

  const handleBenefitPlanSubmit = () => {
    console.log('Benefit Plan Investor form submitted:', { benefitPlanStatus, benefitPlanDetails })
    setOpen(false)
    
    setAnswers(prevAnswers => [
      ...prevAnswers,
      `Benefit Plan Investor Status: ${benefitPlanStatus === 'notBenefitPlan' ? 'Not a Benefit Plan Investor' : 'Benefit Plan Investor'}`,
      ...(benefitPlanStatus === 'benefitPlan' ? [
        `Type: ${benefitPlanDetails.type === 'subject' ? 'Subject to ERISA' : 'Investing plan assets'}`,
        ...(benefitPlanDetails.type === 'investing' ? [`Plan asset percentage: ${benefitPlanDetails.planAssetPercentage}`] : [])
      ] : [])
    ])
  }

  // New function to handle basic info submission
  const handleBasicInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Basic info submitted:', basicInfo)
    setCurrentStep('consent')
  }

  // New function to handle basic info changes
  const handleBasicInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setBasicInfo(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
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
            Add Additional Signatories (optional)
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
          />
        </div>
        
        <div>
          <Label htmlFor="accountHolderName">Account Holder Name (If different from above LP signatory)</Label>
          <Input
            id="accountHolderName"
            name="accountHolderName"
            value={bankFormData.accountHolderName}
            onChange={handleBankFormChange}
          />
        </div>
        <div>
          <Label htmlFor="accountNumber">Account Number</Label>
          <Input
            id="accountNumber"
            name="accountNumber"
            value={bankFormData.accountNumber}
            onChange={handleBankFormChange}
          />
        </div>
        <div>
          <Label htmlFor="routingNumber">Routing Number</Label>
          <Input
            id="routingNumber"
            name="routingNumber"
            value={bankFormData.routingNumber}
            onChange={handleBankFormChange}
          />
        </div>
        <DialogFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={handleBack}>Back</Button>
          <div className="space-x-2">
            <Button type="button" variant="secondary" onClick={handleSkipBankInfo}>Skip for now</Button>
            <Button type="submit">Next</Button>
          </div>
        </DialogFooter>
      </form>
    </ScrollArea>
  )

  const renderInitialsForm = () => (
    <div className="space-y-4">
      <p>Type your initials below.</p>
      <div className="flex items-center space-x-4">
        <div>
          <Label htmlFor="userInitials">Your Initials</Label>
          <Input
            id="userInitials"
            value={userInitials}
            onChange={(e) => setUserInitials(e.target.value)}
            placeholder="Initials"
            className="w-24 text-center"
          />
        </div>
        {userInitials && (
          <div className={`${kalam.className} text-4xl text-blue-600 font-bold`}>
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
          {[
            { id: 'rep1', label: 'a natural person who (or a company that) immediately after entering into the contract has at least $1,100,000 under the management of the investment adviser' },
            { id: 'rep2', label: 'any natural person or company (other than a company that is required to be registered under the Investment Company Act but is not registered) that has a net worth (together, in the case of a natural person, with assets held jointly with a spouse) of more than $2,200,000' },
            { id: 'rep3', label: 'a natural person who is an executive officer, director, trustee, general partner, or person serving in a similar capacity, of the General Partner, or an employee of the General Partner (other than an employee performing solely clerical, secretarial or administrative functions with regard to the General Partner) who, in connection with his or her regular functions or duties, participates in the investment activities of such General Partner, provided that such employee has been performing such functions and duties for or on behalf of the General Partner, or substantially similar functions or duties for or on behalf of another company for at least 12 months' },
            { id: 'rep4', label: 'any natural person or company (other than a company that is required to be registered under the Investment Company Act but is not registered) that is a "qualified purchaser" as defined under the 1940 Act' },
            { id: 'rep5', label: 'a private investment company, such that the company would be defined as an investment company under section 3(a) of the Investment Company Act, but for the exception provided from that definition by section 3(c)(1) of the Investment Company Act, an investment company registered under the Investment Company Act or a business development company as defined in the Investment Company Act, and each equity owner of such entity satisfies one of the above conditions.' },
          ].map(({ id, label }) => (
            <div key={id} className="space-y-2">
              <Label>
                {label}
              </Label>
              <InitialInput
                id={id}
                isInitialed={qualifiedClientRepresentations[id as keyof typeof qualifiedClientRepresentations].initialed}
                onInitial={() => handleQualifiedClientChange(id as keyof typeof qualifiedClientRepresentations, 'initial')}
                onRemove={() => handleQualifiedClientChange(id as keyof typeof qualifiedClientRepresentations, 'remove')}
              />
            </div>
          ))}
        </div>
        <DialogFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={handleBack}>Back</Button>
          <Button type="submit">Next</Button>
        </DialogFooter>
      </form>
    </ScrollArea>
  )

  const renderAccreditedForm = () => (
    <ScrollArea className="h-[400px] pr-4">
      <form onSubmit={(e) => { e.preventDefault(); handleAccreditedSubmit(); }} className="space-y-4">
        <div className="space-y-4">
          {[
            { id: 'income', label: '(i) an individual who had an income in excess of $200,000 in each of the two most recent years (or joint income with his or her spouse or spousal equivalent , in excess of $300,000 in each of those years) and has a reasonable expectation of reaching the same income level in the coming year' },
            { id: 'netWorth', label: '(ii) an individual who has a net worth (or joint net worth with his or her spouse) in excess of $1,000,000, not including the value of their primary residence but reduced by the amount of any outstanding secured debt (i.e., mortgage) on such primary residence that exceeds the fair market value of such residence' },
            { id: 'seriesExams', label: '(iii) an individual holding, in good standing, one or more professional certifications or designations, which at this time the SEC has limited to FINRA Series 7, Series 82, or Series 65 licenses' },
            { id: 'businessOwner', label: '(iv) an individual that is a "knowledgeable employee" of the Fund' },
            { id: 'iraRevocabletrust', label: '(v) an Individual Retirement Account ("IRA") or revocable trust and the individual who established the IRA or each grantor of the trust is an accredited investor on the basis of (i) through (iv) above' },
            { id: 'selfdirectedPlan', label: '(vi) a self-directed pension plan and the participant who directed that assets of his or her account be invested in the Fund is an accredited investor on the basis of (i) through (iv) above and such participant is the only participant whose account is being invested in the Fund' },
            { id: 'trustFamilyOffice', label: '(vii) any trust or family office (a) with total assets in excess of $5,000,000, (b) which was not formed for the specific purpose of investing in the Fund and (c) whose purchase is directed by a person who has such knowledge and experience in financial and business matters that he or she is capable or evaluating the merits and risks of the prospective investment' },
            { id: 'pensionEntity', label: '(viii) a pension plan which is not a self-directed plan, a corporation, a partnership or Massachusetts or similar business trust, that was not formed for the specific purpose of acquiring interest in the Fund, with total assets in excess of $5,000,000 or that owns investments in excess of $5,000,000' },
            { id: 'accredEntity', label: '(ix) an entity in which all of the equity owners are accredited investors' },
          ].map(({ id, label }) => (
            <div key={id} className="flex items-center space-x-2">
              <Checkbox
                id={id}
                checked={accreditedStatus[id as keyof typeof accreditedStatus]}
                onCheckedChange={() => handleAccreditedStatusChange(id as keyof typeof accreditedStatus)}
              />
              <Label htmlFor={id}>
                {label}
              </Label>
            </div>
          ))}
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
        <span className={`${kalam.className} text-2xl font-bold text-blue-600`}>{userInitials}</span>
      )}
    </div>
  )

  const renderBenefitPlanForm = () => (
    <div className="space-y-4">
      <p>The New Limited Partner represents that it is (please check all applicable boxes):</p>
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="notBenefitPlan" 
            checked={benefitPlanStatus === 'notBenefitPlan'}
            onCheckedChange={() => {
              setBenefitPlanStatus('notBenefitPlan')
              setBenefitPlanDetails({ type: null, planAssetPercentage: null })
            }}
          />
          <Label htmlFor="notBenefitPlan">not a Benefit Plan Investor; or</Label>
        </div>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="benefitPlan" 
              checked={benefitPlanStatus === 'benefitPlan'}
              onCheckedChange={() => setBenefitPlanStatus('benefitPlan')}
            />
            <Label htmlFor="benefitPlan">a Benefit Plan Investor that is:</Label>
          </div>
          {benefitPlanStatus === 'benefitPlan' && (
            <div className="ml-6 space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="subject" 
                  checked={benefitPlanDetails.type === 'subject'}
                  onCheckedChange={(checked) => 
                    setBenefitPlanDetails(prev => ({ type: checked ? 'subject' : null, planAssetPercentage: null }))
                  }
                />
                <Label htmlFor="subject">subject to Part 4 of Title I of ERISA</Label>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="investing" 
                    checked={benefitPlanDetails.type === 'investing'}
                    onCheckedChange={(checked) => 
                      setBenefitPlanDetails(prev => ({ type: checked ? 'investing' : null, planAssetPercentage: null }))
                    }
                  />
                  <Label htmlFor="investing">an entity whose underlying assets include "plan assets" that are not subject to Title I of ERISA. The New Limited Partner also represents that the percentage of such "plan assets" compared to the value of its total assets is not more than:</Label>
                </div>
                {benefitPlanDetails.type === 'investing' && (
                  <div className="ml-6 grid grid-cols-2 gap-2">
                    {['10%', '20%', '30%', '40%', '50%', '60%', '70%', '80%', '90%', '100%'].map((percentage) => (
                      <div key={percentage} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`percentage-${percentage}`}
                          checked={benefitPlanDetails.planAssetPercentage === percentage}
                          onCheckedChange={() => 
                            setBenefitPlanDetails(prev => ({ ...prev, planAssetPercentage: percentage as any }))
                          }
                        />
                        <Label htmlFor={`percentage-${percentage}`}>{percentage}{percentage === '10%' || percentage === '20%' ? ' *' : ''}</Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <p className="text-sm italic">* applicable to entities with multiple classes, one of which exceeds the 25% threshold for Benefit Plan Investors</p>
      <DialogFooter className="flex justify-between">
        <Button type="button" variant="outline" onClick={handleBack}>Back</Button>
        <Button onClick={handleBenefitPlanSubmit} disabled={!benefitPlanStatus || (benefitPlanStatus === 'benefitPlan' && (!benefitPlanDetails.type || (benefitPlanDetails.type === 'investing' && !benefitPlanDetails.planAssetPercentage)))}>Next</Button>
      </DialogFooter>
    </div>
  )

  // New function to render the basic info form
  const renderBasicInfoForm = () => (
    <ScrollArea className="h-[400px] pr-4">
      <form onSubmit={handleBasicInfoSubmit} className="space-y-4">
        <RadioGroup value={entityType || ''} onValueChange={(value) => setEntityType(value as 'individual' | 'entity')}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="individual" id="individual" />
            <Label htmlFor="individual">Individual (including individual IRA)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="entity" id="entity" />
            <Label htmlFor="entity">Entity / Trust</Label>
          </div>
        </RadioGroup>

        {entityType && (
          <>
            <div>
              <Label htmlFor="fullLegalName">Full Legal Name of New LP</Label>
              <Input
                id="fullLegalName"
                name="fullLegalName"
                value={basicInfo.fullLegalName}
                onChange={handleBasicInfoChange}
                required
              />
            </div>

            {entityType === 'individual' ? (
              <>
                <div>
                  <Label htmlFor="ssn">Social Security Number</Label>
                  <Input
                    id="ssn"
                    name="ssn"
                    value={basicInfo.ssn}
                    onChange={handleBasicInfoChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={basicInfo.dateOfBirth}
                    onChange={handleBasicInfoChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="birthPlace">State or Province and Country of Birth</Label>
                  <Input
                    id="birthPlace"
                    name="birthPlace"
                    value={basicInfo.birthPlace}
                    onChange={handleBasicInfoChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="citizenship">Country of Citizenship</Label>
                  <Input
                    id="citizenship"
                    name="citizenship"
                    value={basicInfo.citizenship}
                    onChange={handleBasicInfoChange}
                    required
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <Label htmlFor="stateOfFormation">State or Country of Formation</Label>
                  <Input
                    id="stateOfFormation"
                    name="stateOfFormation"
                    value={basicInfo.stateOfFormation}
                    onChange={handleBasicInfoChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="dateOfFormation">Date of Formation</Label>
                  <Input
                    id="dateOfFormation"
                    name="dateOfFormation"
                    type="date"
                    value={basicInfo.dateOfFormation}
                    onChange={handleBasicInfoChange}
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isControlledPerson"
                    name="isControlledPerson"
                    checked={basicInfo.isControlledPerson}
                    onCheckedChange={(checked) => setBasicInfo(prev => ({ ...prev, isControlledPerson: checked as boolean }))}
                  />
                  <Label htmlFor="isControlledPerson">Is the new LP a controlled person?</Label>
                </div>
                <div>
                  <Label htmlFor="authorizedSignatoryTitle">Title of Authorized Signatory</Label>
                  <Input
                    id="authorizedSignatoryTitle"
                    name="authorizedSignatoryTitle"
                    value={basicInfo.authorizedSignatoryTitle}
                    onChange={handleBasicInfoChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="taxId">Taxpayer Identification Number</Label>
                  <Input
                    id="taxId"
                    name="taxId"
                    value={basicInfo.taxId}
                    onChange={handleBasicInfoChange}
                    required
                  />
                </div>
              </>
            )}

            <div>
              <Label htmlFor="address">
                {entityType === 'individual' ? 'Current Residence Address' : 'Address of New LP'}
              </Label>
              <Input
                id="address"
                name="address"
                value={basicInfo.address}
                onChange={handleBasicInfoChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="phoneNumber">Telephone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={basicInfo.phoneNumber}
                onChange={handleBasicInfoChange}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={basicInfo.email}
                onChange={handleBasicInfoChange}
                required
              />
            </div>
          </>
        )}

        <DialogFooter>
          <Button type="submit" disabled={!entityType}>Next</Button>
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
        <div className="flex flex-col items-center">
          <Button 
            onClick={() => setHasStarted(true)}
            className={cn(
              "w-32", // Fixed width instead of w-full
              isCompleted 
                ? "bg-blue-500 hover:bg-blue-600" 
                : "bg-green-500 hover:bg-green-600"
            )}
          >
            {!hasStarted 
              ? "Begin" 
              : isCompleted 
                ? "Complete" 
                : "Resume"}
          </Button>
          {isCompleted && (
            <span className="text-sm text-gray-500 mt-1">
              Click to review/revise
            </span>
          )}
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[625px] bg-white">
        <DialogHeader>
          <DialogTitle>
            {currentStep === 'basicInfo' ? 'Basic Information' :
             currentStep === 'consent' ? 'Consent and Authorized Signatories' : 
             currentStep === 'bank' ? 'Bank Account Information' : 
             currentStep === 'accredited' ? 'Accredited Investor Status' :
             currentStep === 'initials' ? 'Provide Your Initials' :
             currentStep === 'qualifiedClient' ? 'Qualified Client Status' :             'Benefit Plan Investor Status'}
          </DialogTitle>
          <DialogDescription>
            {currentStep === 'basicInfo' ? 'Please provide basic information about the new Limited Partner.' :
             currentStep === 'consent' ? 'Please provide your consent and list the authorized signatories for the fund.' : 
             currentStep === 'bank' ? 'Please provide your bank account information.' :
             currentStep === 'accredited' ? 'Please indicate which of the following accredited investor criteria apply to you.' :
             currentStep === 'initials' ? 'Please provide your initials for document completion.' :
             currentStep === 'qualifiedClient' ? 'Please initial the following representations if they apply to you.' :
             'Please indicate your Benefit Plan Investor status.'}
          </DialogDescription>
        </DialogHeader>
        <Progress value={getProgressValue(currentStep)} className="mb-4" />
        {currentStep === 'basicInfo' ? renderBasicInfoForm() :
         currentStep === 'consent' ? renderConsentForm() : 
         currentStep === 'bank' ? renderBankForm() : 
         currentStep === 'accredited' ? renderAccreditedForm() :
         currentStep === 'initials' ? renderInitialsForm() :
         currentStep === 'qualifiedClient' ? renderQualifiedClientForm() :
         renderBenefitPlanForm()}
        {showWarning && (
          <div className="text-red-500 mt-2">
            Please complete all required fields and provide consent.
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

// Helper function to calculate progress value
function getProgressValue(currentStep: string): number {
  const steps = ['basicInfo', 'consent', 'bank', 'accredited', 'initials', 'qualifiedClient', 'benefitPlan']
  const currentIndex = steps.indexOf(currentStep)
  return ((currentIndex + 1) / steps.length) * 100
}