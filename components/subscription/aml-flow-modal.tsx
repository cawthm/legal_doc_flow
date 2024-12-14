'use client'

import { useState, Dispatch, SetStateAction, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { getInitialStates } from "@/utils/storage"

interface SubscriberInfo {
  category: 'individual' | 'trust' | 'publicCompany' | 'partnership' | 'financialInstitution' | null;
  bankName: string;
  bankType: 'foreign' | 'domestic' | null;
  foreignCountry?: string;
  isCustomer: boolean | null;
}

interface EmploymentInfo {
  employerName: string;
  isPubliclyTraded: boolean | null;
  industry: string;
  positionHeld: string;
  isSeniorExecutive: boolean | null;
  familyMember: {
    name: string;
    companyName: string;
    positionHeld: string;
  };
  isGovernmentEmployee: boolean | null;
}

// Add this to track completion of each section
interface CompletionStatus {
  subscriberInfo: boolean;
  employmentInfo: boolean;
}

export function AMLFlowModal({ setAnswers }: { setAnswers: Dispatch<SetStateAction<string[]>> }) {
  const [open, setOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState('intro')
  const [subscriberInfo, setSubscriberInfo] = useState<SubscriberInfo>({
    category: null,
    bankName: '',
    bankType: null,
    foreignCountry: '',
    isCustomer: null,
  })
  const [employmentInfo, setEmploymentInfo] = useState<EmploymentInfo>({
    employerName: '',
    isPubliclyTraded: null,
    industry: '',
    positionHeld: '',
    isSeniorExecutive: null,
    familyMember: {
      name: '',
      companyName: '',
      positionHeld: '',
    },
    isGovernmentEmployee: null,
  })
  const [isCompleted, setIsCompleted] = useState<boolean>(false)
  const [sectionCompletion, setSectionCompletion] = useState<CompletionStatus>({
    subscriberInfo: false,
    employmentInfo: false
  })
  const [hasStarted, setHasStarted] = useState(false)

  useEffect(() => {
    const { isAMLComplete } = getInitialStates()
    setIsCompleted(isAMLComplete)
  }, [])

  useEffect(() => {
    console.log('Current step changed to:', currentStep)
  }, [currentStep])

  // Update completion status whenever subscriberInfo changes
  useEffect(() => {
    if (isSubscriberInfoComplete()) {
      setSectionCompletion(prev => ({ ...prev, subscriberInfo: true }))
    }
  }, [subscriberInfo])

  // Update completion status whenever employmentInfo changes
  useEffect(() => {
    if (isEmploymentInfoComplete()) {
      setSectionCompletion(prev => ({ ...prev, employmentInfo: true }))
    }
  }, [employmentInfo])

  // Check overall completion
  useEffect(() => {
    if (sectionCompletion.subscriberInfo && sectionCompletion.employmentInfo) {
      setIsCompleted(true)
    }
  }, [sectionCompletion])

  const handleStart = () => {
    setCurrentStep('subscriberInfo')
  }

  const isSubscriberInfoComplete = () => {
    return (
      subscriberInfo.category !== null &&
      subscriberInfo.bankName.trim() !== '' &&
      subscriberInfo.bankType !== null &&
      subscriberInfo.isCustomer !== null &&
      !(subscriberInfo.bankType === 'foreign' && !subscriberInfo.foreignCountry?.trim())
    )
  }

  const handleSubscriberInfoSubmit = () => {
    if (!isSubscriberInfoComplete()) {
      return
    }
    
    console.log('Subscriber info submitted:', subscriberInfo)
    setCurrentStep('employmentInfo')
  }

  const handleEmploymentInfoSubmit = () => {
    if (!isEmploymentInfoComplete()) {
      return
    }
    
    console.log('Employment info submitted:', employmentInfo)
    setIsCompleted(true)
    setOpen(false)
  }

  const isEmploymentInfoComplete = () => {
    return (
      employmentInfo.employerName.trim() !== '' &&
      employmentInfo.isPubliclyTraded !== null &&
      employmentInfo.industry.trim() !== '' &&
      employmentInfo.positionHeld.trim() !== '' &&
      employmentInfo.isSeniorExecutive !== null &&
      employmentInfo.isGovernmentEmployee !== null
    )
  }

  const handleReviewStart = () => {
    setCurrentStep('intro')
    setOpen(true)
  }

  const renderSubscriberInfoModal = () => (
    <DialogContent className="sm:max-w-[600px] bg-white">
      <DialogHeader>
        <DialogTitle>Subscriber Information</DialogTitle>
        <DialogDescription>
          Please provide information about the subscriber and their banking details.
        </DialogDescription>
      </DialogHeader>
      
      <div className="space-y-6 py-4">
        {/* Category Selection */}
        <div className="space-y-4">
          <Label className="font-bold">
            Indicate the category which best describes the Subscriber:
          </Label>
          <RadioGroup
            value={subscriberInfo.category || ''}
            onValueChange={(value) => setSubscriberInfo(prev => ({
              ...prev,
              category: value as SubscriberInfo['category']
            }))}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="individual" id="individual" />
              <Label htmlFor="individual">Individual</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="trust" id="trust" />
              <Label htmlFor="trust">Trust</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="publicCompany" id="publicCompany" />
              <Label htmlFor="publicCompany">Publicly Held Company</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="partnership" id="partnership" />
              <Label htmlFor="partnership">Partnership or Privately Held Entity (e.g. L.P., L.L.C., PLC, etc.)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="financialInstitution" id="financialInstitution" />
              <Label htmlFor="financialInstitution">Financial Institution</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Bank Name */}
        <div className="space-y-2">
          <Label htmlFor="bankName">
            Name of the bank from which Subscriber contribution is being wired:
          </Label>
          <Input
            id="bankName"
            value={subscriberInfo.bankName}
            onChange={(e) => setSubscriberInfo(prev => ({
              ...prev,
              bankName: e.target.value
            }))}
            className={cn(
              "focus:ring-2",
              !subscriberInfo.bankName.trim() && "border-red-500 focus:ring-red-500"
            )}
          />
        </div>

        {/* Bank Type */}
        <div className="space-y-4">
          <Label>
            Is the wire from a:
          </Label>
          <RadioGroup
            value={subscriberInfo.bankType || ''}
            onValueChange={(value) => setSubscriberInfo(prev => ({
              ...prev,
              bankType: value as 'foreign' | 'domestic'
            }))}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="foreign" id="foreign" />
              <Label htmlFor="foreign">Foreign Bank</Label>
            </div>
            {subscriberInfo.bankType === 'foreign' && (
              <div className="ml-6">
                <Label htmlFor="foreignCountry">
                  If yes, which country:
                </Label>
                <Input
                  id="foreignCountry"
                  className={cn(
                    "mt-1",
                    subscriberInfo.bankType === 'foreign' && !subscriberInfo.foreignCountry?.trim() && 
                    "border-red-500 focus:ring-red-500"
                  )}
                  value={subscriberInfo.foreignCountry}
                  onChange={(e) => setSubscriberInfo(prev => ({
                    ...prev,
                    foreignCountry: e.target.value
                  }))}
                />
              </div>
            )}
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="domestic" id="domestic" />
              <Label htmlFor="domestic">Domestic Bank</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Customer Status */}
        <div className="space-y-4">
          <Label>
            Are you a customer of the bank?
          </Label>
          <RadioGroup
            value={subscriberInfo.isCustomer === null ? '' : subscriberInfo.isCustomer.toString()}
            onValueChange={(value) => setSubscriberInfo(prev => ({
              ...prev,
              isCustomer: value === 'true'
            }))}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id="yes" />
              <Label htmlFor="yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id="no" />
              <Label htmlFor="no">No</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <DialogFooter className="flex justify-between">
        <Button type="button" variant="outline" onClick={() => setCurrentStep('intro')}>
          Back
        </Button>
        <Button 
          onClick={handleSubscriberInfoSubmit}
          disabled={!isSubscriberInfoComplete()}
          className={cn(
            !isSubscriberInfoComplete() && "opacity-50 cursor-not-allowed"
          )}
        >
          Next
        </Button>
      </DialogFooter>
    </DialogContent>
  )

  const renderEmploymentInfoModal = () => (
    <DialogContent className="sm:max-w-[600px] bg-white max-h-[90vh] flex flex-col">
      <DialogHeader>
        <DialogTitle>Employment Information</DialogTitle>
        <DialogDescription>
          Please provide information about your employment status.
        </DialogDescription>
      </DialogHeader>
      
      <div className="flex-1 overflow-y-auto pr-4">
        <div className="space-y-6 py-4">
          {/* Employer Information */}
          <div className="space-y-2">
            <Label htmlFor="employerName">Name of Employer:</Label>
            <Input
              id="employerName"
              value={employmentInfo.employerName}
              onChange={(e) => setEmploymentInfo(prev => ({
                ...prev,
                employerName: e.target.value
              }))}
              className={cn(
                "focus:ring-2",
                !employmentInfo.employerName.trim() && "border-red-500 focus:ring-red-500"
              )}
            />
          </div>

          {/* Publicly Traded & Industry */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Publicly traded company:</Label>
              <RadioGroup
                value={employmentInfo.isPubliclyTraded === null ? '' : employmentInfo.isPubliclyTraded.toString()}
                onValueChange={(value) => setEmploymentInfo(prev => ({
                  ...prev,
                  isPubliclyTraded: value === 'true'
                }))}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="publicYes" />
                  <Label htmlFor="publicYes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="publicNo" />
                  <Label htmlFor="publicNo">No</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industry:</Label>
              <Input
                id="industry"
                value={employmentInfo.industry}
                onChange={(e) => setEmploymentInfo(prev => ({
                  ...prev,
                  industry: e.target.value
                }))}
                className={cn(
                  "focus:ring-2",
                  !employmentInfo.industry.trim() && "border-red-500 focus:ring-red-500"
                )}
              />
            </div>
          </div>

          {/* Position & Senior Executive Status */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="positionHeld">Position Held:</Label>
              <Input
                id="positionHeld"
                value={employmentInfo.positionHeld}
                onChange={(e) => setEmploymentInfo(prev => ({
                  ...prev,
                  positionHeld: e.target.value
                }))}
                className={cn(
                  "focus:ring-2",
                  !employmentInfo.positionHeld.trim() && "border-red-500 focus:ring-red-500"
                )}
              />
            </div>

            <div className="space-y-2">
              <Label>Senior Executive or Director:</Label>
              <RadioGroup
                value={employmentInfo.isSeniorExecutive === null ? '' : employmentInfo.isSeniorExecutive.toString()}
                onValueChange={(value) => setEmploymentInfo(prev => ({
                  ...prev,
                  isSeniorExecutive: value === 'true'
                }))}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="true" id="seniorYes" />
                  <Label htmlFor="seniorYes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="false" id="seniorNo" />
                  <Label htmlFor="seniorNo">No</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* Family Member Section - Optional fields */}
          <div className="space-y-4">
            <Label className="block text-sm font-medium">
              If a member of Subscriber's immediate family is a senior executive or director at a publicly traded company, please list:
            </Label>
            <div className="space-y-2">
              <Label htmlFor="familyMemberName">Family member's name:</Label>
              <Input
                id="familyMemberName"
                value={employmentInfo.familyMember.name}
                onChange={(e) => setEmploymentInfo(prev => ({
                  ...prev,
                  familyMember: { ...prev.familyMember, name: e.target.value }
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="familyMemberCompany">Name of Company:</Label>
              <Input
                id="familyMemberCompany"
                value={employmentInfo.familyMember.companyName}
                onChange={(e) => setEmploymentInfo(prev => ({
                  ...prev,
                  familyMember: { ...prev.familyMember, companyName: e.target.value }
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="familyMemberPosition">Position Held:</Label>
              <Input
                id="familyMemberPosition"
                value={employmentInfo.familyMember.positionHeld}
                onChange={(e) => setEmploymentInfo(prev => ({
                  ...prev,
                  familyMember: { ...prev.familyMember, positionHeld: e.target.value }
                }))}
              />
            </div>
          </div>

          {/* Government Employee */}
          <div className="space-y-2">
            <Label>Government employee:</Label>
            <RadioGroup
              value={employmentInfo.isGovernmentEmployee === null ? '' : employmentInfo.isGovernmentEmployee.toString()}
              onValueChange={(value) => setEmploymentInfo(prev => ({
                ...prev,
                isGovernmentEmployee: value === 'true'
              }))}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="govYes" />
                <Label htmlFor="govYes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="govNo" />
                <Label htmlFor="govNo">No</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>

      <DialogFooter className="flex justify-between mt-6 border-t pt-4">
        <Button type="button" variant="outline" onClick={() => setCurrentStep('subscriberInfo')}>
          Back
        </Button>
        <Button 
          onClick={handleEmploymentInfoSubmit}
          disabled={!isEmploymentInfoComplete()}
          className={cn(
            !isEmploymentInfoComplete() && "opacity-50 cursor-not-allowed"
          )}
        >
          Next
        </Button>
      </DialogFooter>
    </DialogContent>
  )

  const renderIntroModal = () => (
    <DialogContent className="sm:max-w-[425px] bg-white">
      <DialogHeader>
        <DialogTitle>Anti Money Laundering (AML) Information</DialogTitle>
        <DialogDescription>
          Financial institutions are required by law to collect certain information to comply with anti-money laundering regulations. This process will require:
          <ul className="list-disc list-inside mt-2">
            <li>Personal financial data</li>
            <li>Proof of identification (scan of passport or driver's license)</li>
          </ul>
          This information helps ensure the integrity and security of our financial system.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button onClick={handleStart}>Begin AML Process</Button>
      </DialogFooter>
    </DialogContent>
  )

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'intro':
        return renderIntroModal()
      case 'subscriberInfo':
        return renderSubscriberInfoModal()
      case 'employmentInfo':
        return renderEmploymentInfoModal()
      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="flex flex-col items-center">
          <Button 
            onClick={() => {
              setHasStarted(true)
              setOpen(true)
            }}
            className={cn(
              "w-full",
              isCompleted ? "bg-blue-500 hover:bg-blue-600" : "bg-green-500 hover:bg-green-600"
            )}
          >
            {!hasStarted ? "Begin" : isCompleted ? "Complete" : "Resume"}
          </Button>
          {isCompleted && (
            <span className="text-sm text-gray-500 mt-1">
              Click to review/revise
            </span>
          )}
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-white">
        {renderCurrentStep()}
      </DialogContent>
    </Dialog>
  )
}