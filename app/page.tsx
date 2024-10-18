'use client'

import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { FileText, Settings } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { SubscriptionFlowModal } from "@/components/subscription/subscription-flow-modal"
import { AMLFlowModal } from "@/components/subscription/aml-flow-modal"
import DownloadPDF from '@/components/DownloadPDF'

export default function Home() {
  const [answers, setAnswers] = useState<string[]>([]);
  const [amlAnswers, setAMLAnswers] = useState<string[]>([]);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Image 
              src="/logo.png" 
              alt="Capital Partners Logo" 
              width={40} 
              height={40} 
              className="mr-2"
            />
            <span className="text-xl font-semibold">Indra Capital Partners</span>
          </div>
          <nav className="flex space-x-4">
            <Link href="#" className="text-gray-600 hover:text-gray-900">Home</Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900">Investments</Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900">Fundraising</Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900">Reports</Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900">Profile</Link>
          </nav>
          <div className="flex items-center space-x-4">
            <Settings className="w-6 h-6 text-gray-600" />
            <div className="w-8 h-8 bg-gray-300 rounded-full overflow-hidden">
              <Image src="/placeholder.svg" alt="User avatar" width={32} height={32} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Step 1/2</h2>
          <Progress value={50} className="mb-6" />
          <h1 className="text-3xl font-bold mb-4">Complete your investment documents</h1>
          <p className="text-gray-600 mb-6">The app will prompt you for information to complete the following documents, necessary for your investment in our fund.</p>
          <Button variant="outline" className="w-full mb-6">Download all documents in blank (ZIP)</Button>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-2">1. Sign the Subscription Agreement</h3>
              <p className="text-gray-600 mb-4">We need you to sign the subscription agreement first. It's a legal requirement and ensures we have all the necessary information for your investment.</p>
              <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
                <div className="flex items-center">
                  <FileText className="w-6 h-6 mr-2 text-gray-600" />
                  <div>
                    <h4 className="font-semibold">Subscription Agreement</h4>
                    <p className="text-sm text-gray-600">Document type: PDF</p>
                  </div>
                </div>
                <SubscriptionFlowModal setAnswers={setAnswers} />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">2. Complete the Anti Money Laundering Supplement</h3>
              <p className="text-gray-600 mb-4">This supplement is required to comply with anti-money laundering regulations and to ensure the integrity of our fund.</p>
              <div className="flex items-center justify-between bg-gray-100 p-4 rounded-lg">
                <div className="flex items-center">
                  <FileText className="w-6 h-6 mr-2 text-gray-600" />
                  <div>
                    <h4 className="font-semibold">Anti Money Laundering Supplement</h4>
                    <p className="text-sm text-gray-600">Document type: PDF</p>
                  </div>
                </div>
                <AMLFlowModal setAnswers={setAMLAnswers} />
              </div>
            </div>
          </div>
          <DownloadPDF answers={answers} />
          <Button className="w-full mt-8">Continue</Button>
        </div>
      </main>
    </div>
  )
}
