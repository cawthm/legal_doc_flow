'use client'

import { useState, Dispatch, SetStateAction } from 'react'
import { Button } from "@/components/ui/button"
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

export function AMLFlowModal({ setAnswers }: { setAnswers: Dispatch<SetStateAction<string[]>> }) {
  const [open, setOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState('intro')

  const handleStart = () => {
    setCurrentStep('personalInfo')
  }

  const renderIntroModal = () => (
    <DialogContent className="sm:max-w-[425px]">
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
      // Add more cases for other steps in the AML process
      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>Begin</Button>
      </DialogTrigger>
      {renderCurrentStep()}
    </Dialog>
  )
}