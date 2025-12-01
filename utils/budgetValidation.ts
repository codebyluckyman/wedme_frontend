export interface FormErrors {
  totalBudget: string;
  guestCount: string;
  location: string;
  weddingDate: string;
  venueType: string;
}

interface FormData {
  totalBudget: string;
  guestCount: string;
  location: string;
  weddingDate: string;
  venueType: string;
}

export const validateForm = (formData: FormData): FormErrors => {
  const errors: FormErrors = {
    totalBudget: '',
    guestCount: '',
    location: '',
    weddingDate: '',
    venueType: '',
  };

  // Validate Total Budget
  if (!formData.totalBudget) {
    errors.totalBudget = 'Total budget is required';
  } else if (
    isNaN(Number(formData.totalBudget)) ||
    Number(formData.totalBudget) <= 0
  ) {
    errors.totalBudget = 'Total budget must be a positive number';
  }

  // Validate Guest Count
  if (!formData.guestCount) {
    errors.guestCount = 'Guest count is required';
  } else if (
    isNaN(Number(formData.guestCount)) ||
    Number(formData.guestCount) <= 0
  ) {
    errors.guestCount = 'Guest count must be a positive number';
  }

  // Validate Location
  if (!formData.location.trim()) {
    errors.location = 'Location is required';
  }

  // Validate Wedding Date
  if (!formData.weddingDate) {
    errors.weddingDate = 'Wedding date is required';
  } else {
    const selectedDate = new Date(formData.weddingDate);
    const currentDate = new Date();
    if (selectedDate < currentDate) {
      errors.weddingDate = 'Wedding date cannot be in the past';
    }
  }

  // Validate Venue Type
  if (!formData.venueType) {
    errors.venueType = 'Venue type is required';
  }

  return errors;
};
