import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, ArrowRight, Building2, AlertCircle, Loader2 } from "lucide-react";
import { useBusinessProfile, useMatching } from "@/hooks/useApi";
import { CreateBusinessProfileRequest, MatchBusinessRequest } from "@/types";

interface BusinessQuestionnaireProps {
  onComplete: (data: any) => void;
}

export const BusinessQuestionnaire = ({ onComplete }: BusinessQuestionnaireProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const [formData, setFormData] = useState({
    // Company Info
    companyName: '',
    registrationNumber: '',
    establishedYear: '',
    industry: '',
    
    // Business Details
    businessModel: '',
    stage: '',
    employees: '',
    revenue: '',
    
    // Funding Needs
    fundingPurpose: [],
    fundingAmount: '',
    timeline: '',
    
    // Additional Info
    location: '',
    description: '',
    challenges: ''
  });

  const { loading: profileLoading, error: profileError, createBusinessProfile } = useBusinessProfile();
  const { loading: matchingLoading, error: matchingError, findMatches } = useMatching();
  const [isProcessing, setIsProcessing] = useState(false);

  const industries = [
    'Technology & IT', 'Manufacturing', 'Retail & E-commerce', 'Food & Beverage',
    'Healthcare', 'Education', 'Agriculture', 'Construction', 'Financial Services',
    'Tourism & Hospitality', 'Logistics & Transportation', 'Professional Services'
  ];

  const businessStages = [
    'Idea Stage', 'Startup (0-2 years)', 'Early Growth (2-5 years)', 
    'Expansion (5+ years)', 'Established Enterprise'
  ];

  const fundingPurposes = [
    'Research & Development', 'Equipment Purchase', 'Working Capital', 'Market Expansion',
    'Digital Transformation', 'Export Development', 'Staff Training', 'Green Technology',
    'Innovation Projects', 'Infrastructure Development'
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFundingPurposeChange = (purpose: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      fundingPurpose: checked 
        ? [...prev.fundingPurpose, purpose]
        : prev.fundingPurpose.filter(p => p !== purpose)
    }));
  };

  const nextStep = async () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    } else {
      await handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsProcessing(true);
    try {
      // Create business profile
      const businessProfile = await createBusinessProfile(formData as CreateBusinessProfileRequest);
      
      // Find matches
      const matchData: MatchBusinessRequest = {
        businessProfileId: businessProfile.id,
        industry: formData.industry,
        stage: formData.stage,
        employees: formData.employees,
        revenue: formData.revenue,
        fundingPurpose: formData.fundingPurpose,
        fundingAmount: formData.fundingAmount,
        location: formData.location,
      };
      
      const matches = await findMatches(matchData);
      
      // Pass both business profile and matches to parent
      onComplete({
        businessProfile,
        matches,
      });
    } catch (error) {
      console.error('Error processing questionnaire:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const progress = (currentStep / totalSteps) * 100;
  const isLoading = profileLoading || matchingLoading || isProcessing;

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Building2 className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">Business Assessment</h1>
          <p className="text-xl text-muted-foreground">
            Help us understand your business to find the perfect grant matches
          </p>
        </div>

        {/* Error Display */}
        {(profileError || matchingError) && (
          <Alert className="mb-6 border-destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {profileError || matchingError}
            </AlertDescription>
          </Alert>
        )}

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Step {currentStep} of {totalSteps}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        <Card className="shadow-feature border-0">
          <CardContent className="p-8">
            {/* Step 1: Company Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-2xl">Company Information</CardTitle>
                </CardHeader>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      placeholder="Your company name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="registrationNumber">SSM Registration Number</Label>
                    <Input
                      id="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                      placeholder="e.g., 123456-A"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="establishedYear">Year Established *</Label>
                    <Input
                      id="establishedYear"
                      type="number"
                      value={formData.establishedYear}
                      onChange={(e) => handleInputChange('establishedYear', e.target.value)}
                      placeholder="YYYY"
                      min="1900"
                      max={new Date().getFullYear()}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry *</Label>
                    <Select onValueChange={(value) => handleInputChange('industry', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map(industry => (
                          <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Business Location (State) *</Label>
                  <Select onValueChange={(value) => handleInputChange('location', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your state" />
                    </SelectTrigger>
                    <SelectContent>
                      {['Kuala Lumpur', 'Selangor', 'Penang', 'Johor', 'Perak', 'Kedah', 'Kelantan', 'Terengganu', 'Pahang', 'Negeri Sembilan', 'Melaka', 'Sabah', 'Sarawak', 'Perlis', 'Putrajaya', 'Labuan'].map(state => (
                        <SelectItem key={state} value={state}>{state}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Step 2: Business Details */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-2xl">Business Details</CardTitle>
                </CardHeader>
                
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label>Business Stage *</Label>
                    <RadioGroup 
                      value={formData.stage} 
                      onValueChange={(value) => handleInputChange('stage', value)}
                      className="grid md:grid-cols-2 gap-4"
                    >
                      {businessStages.map(stage => (
                        <div key={stage} className="flex items-center space-x-2">
                          <RadioGroupItem value={stage} id={stage} />
                          <Label htmlFor={stage} className="font-normal">{stage}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="employees">Number of Employees *</Label>
                      <Select onValueChange={(value) => handleInputChange('employees', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select employee count" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-5">1-5 employees</SelectItem>
                          <SelectItem value="6-30">6-30 employees</SelectItem>
                          <SelectItem value="31-75">31-75 employees</SelectItem>
                          <SelectItem value="76-200">76-200 employees</SelectItem>
                          <SelectItem value="200+">200+ employees</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="revenue">Annual Revenue (RM) *</Label>
                      <Select onValueChange={(value) => handleInputChange('revenue', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select revenue range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="<300k">Less than RM 300,000</SelectItem>
                          <SelectItem value="300k-3m">RM 300,000 - RM 3 million</SelectItem>
                          <SelectItem value="3m-20m">RM 3 million - RM 20 million</SelectItem>
                          <SelectItem value="20m-50m">RM 20 million - RM 50 million</SelectItem>
                          <SelectItem value="50m+">More than RM 50 million</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Business Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Briefly describe your business, products/services, and target market..."
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Funding Needs */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-2xl">Funding Requirements</CardTitle>
                </CardHeader>
                
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label>What do you need funding for? (Select all that apply) *</Label>
                    <div className="grid md:grid-cols-2 gap-4">
                      {fundingPurposes.map(purpose => (
                        <div key={purpose} className="flex items-center space-x-2">
                          <Checkbox
                            id={purpose}
                            checked={formData.fundingPurpose.includes(purpose)}
                            onCheckedChange={(checked) => handleFundingPurposeChange(purpose, checked as boolean)}
                          />
                          <Label htmlFor={purpose} className="font-normal">{purpose}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fundingAmount">Funding Amount Needed (RM) *</Label>
                      <Select onValueChange={(value) => handleInputChange('fundingAmount', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select funding range" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="<50k">Less than RM 50,000</SelectItem>
                          <SelectItem value="50k-200k">RM 50,000 - RM 200,000</SelectItem>
                          <SelectItem value="200k-500k">RM 200,000 - RM 500,000</SelectItem>
                          <SelectItem value="500k-2m">RM 500,000 - RM 2 million</SelectItem>
                          <SelectItem value="2m+">More than RM 2 million</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="timeline">When do you need the funding? *</Label>
                      <Select onValueChange={(value) => handleInputChange('timeline', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select timeline" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="immediate">Immediately</SelectItem>
                          <SelectItem value="1-3months">Within 1-3 months</SelectItem>
                          <SelectItem value="3-6months">Within 3-6 months</SelectItem>
                          <SelectItem value="6-12months">Within 6-12 months</SelectItem>
                          <SelectItem value="flexible">Flexible timeline</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Additional Information */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-2xl">Additional Information</CardTitle>
                </CardHeader>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="challenges">Current Business Challenges</Label>
                    <Textarea
                      id="challenges"
                      value={formData.challenges}
                      onChange={(e) => handleInputChange('challenges', e.target.value)}
                      placeholder="What are the main challenges your business is facing? (Optional)"
                      rows={4}
                    />
                  </div>
                  
                  <div className="bg-accent/50 p-6 rounded-lg">
                    <h4 className="font-semibold mb-2 text-foreground">Review Your Information</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Please review the information you've provided. Our AI will use this to find the best grant matches for your business.
                    </p>
                    <div className="text-sm space-y-1 text-muted-foreground">
                      <p><strong>Company:</strong> {formData.companyName || 'Not specified'}</p>
                      <p><strong>Industry:</strong> {formData.industry || 'Not specified'}</p>
                      <p><strong>Stage:</strong> {formData.stage || 'Not specified'}</p>
                      <p><strong>Location:</strong> {formData.location || 'Not specified'}</p>
                      <p><strong>Funding Need:</strong> {formData.fundingAmount || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              <Button 
                variant="outline" 
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>
              
              <Button 
                onClick={nextStep}
                disabled={isLoading}
                className="flex items-center gap-2 bg-gradient-primary hover:opacity-90"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {currentStep === totalSteps ? 'Finding Matches...' : 'Processing...'}
                  </>
                ) : (
                  <>
                    {currentStep === totalSteps ? 'Find My Matches' : 'Next Step'}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};