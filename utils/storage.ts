interface SubscriptionData {
  currentStep?: string;
  // Add other fields as needed
}

export function getSubscriptionData(): SubscriptionData | null {
  if (typeof window === 'undefined') return null;
  
  const data = localStorage.getItem('subscriptionData')
  if (!data) return null;
  
  try {
    return JSON.parse(data)
  } catch {
    return null
  }
}

export function saveSubscriptionData(data: SubscriptionData): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('subscriptionData', JSON.stringify(data))
}

export function getInitialStates() {
  const data = getSubscriptionData()
  return {
    isSubscriptionComplete: Boolean(
      data?.currentStep &&
      data.currentStep !== ''
    ),
    isAMLComplete: Boolean(
      data?.currentStep &&
      data.currentStep !== ''
    )
  }
} 