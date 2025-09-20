import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, FileText, Award, Banknote, Clock, Building2, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";

interface ProgramResultsProps {
  businessData: any;
  onBack: () => void;
}

// Mock program data - In real implementation, this would come from AI analysis
const mockPrograms = [
  {
    id: 1,
    name: "SME Digitalization Grant",
    provider: "Malaysia Digital Economy Corporation (MDEC)",
    type: "Government Grant",
    matchScore: 95,
    fundingAmount: "Up to RM 50,000",
    description: "Funding to help SMEs adopt digital technologies and improve operational efficiency through digitalization initiatives.",
    eligibility: [
      "Malaysian-owned SME with at least 51% local shareholding",
      "Annual sales turnover between RM 300,000 to RM 20 million",
      "Valid SSM registration",
      "Minimum 1 year in operation"
    ],
    benefits: [
      "Up to 70% co-funding for digital adoption",
      "Technical consultation and support",
      "Access to certified digital solution providers",
      "Post-implementation monitoring and support"
    ],
    applicationLink: "https://www.mdec.my/what-we-offer/grants-programs/sme-digitalization-grant/",
    deadline: "31 December 2024",
    processingTime: "8-12 weeks",
    status: "Open for Applications"
  },
  {
    id: 2,
    name: "SME Bank Micro Financing Scheme",
    provider: "SME Bank",
    type: "Bank Financing",
    matchScore: 88,
    fundingAmount: "RM 5,000 - RM 50,000",
    description: "Micro financing scheme designed to provide easy access to funding for micro enterprises and small businesses.",
    eligibility: [
      "Malaysian citizen aged 18 and above",
      "Valid business registration (SSM/Local Council)",
      "Business operational for at least 6 months",
      "Good credit standing"
    ],
    benefits: [
      "Competitive profit rates starting from 6% per annum",
      "Flexible repayment period up to 5 years",
      "Minimal documentation required",
      "Quick approval process"
    ],
    applicationLink: "https://www.smebank.com.my/financing/micro-financing",
    deadline: "Ongoing",
    processingTime: "2-4 weeks",
    status: "Always Available"
  },
  {
    id: 3,
    name: "Bumiputera Entrepreneur Development Scheme",
    provider: "SME Corporation Malaysia",
    type: "Special Scheme",
    matchScore: 82,
    fundingAmount: "Up to RM 500,000",
    description: "Comprehensive development program for Bumiputera entrepreneurs including funding, training, and business development support.",
    eligibility: [
      "100% Bumiputera-owned business",
      "SME classification based on SME Corp definition",
      "Business plan and feasibility study required",
      "Attended entrepreneur development program"
    ],
    benefits: [
      "Soft loan with subsidized interest rate",
      "Business advisory and mentoring services",
      "Market linkage opportunities",
      "Capacity building programs"
    ],
    applicationLink: "https://www.smecorp.gov.my/index.php/en/programmes/financial-assistance",
    deadline: "Quarterly intake",
    processingTime: "12-16 weeks",
    status: "Next Intake: Q1 2024"
  }
];

export const ProgramResults = ({ businessData, onBack }: ProgramResultsProps) => {
  const [selectedProgram, setSelectedProgram] = useState<any>(null);

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "bg-success text-success-foreground";
    if (score >= 80) return "bg-primary text-primary-foreground";
    return "bg-secondary text-secondary-foreground";
  };

  const getStatusColor = (status: string) => {
    if (status.includes("Open") || status.includes("Available")) return "text-success";
    if (status.includes("Next")) return "text-primary";
    return "text-muted-foreground";
  };

  if (selectedProgram) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-6 max-w-4xl">
          <Button 
            variant="outline" 
            onClick={() => setSelectedProgram(null)}
            className="mb-6 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Results
          </Button>

          <Card className="shadow-feature border-0">
            <CardHeader className="bg-gradient-primary text-white rounded-t-lg">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl mb-2">{selectedProgram.name}</CardTitle>
                  <CardDescription className="text-white/90">
                    {selectedProgram.provider} • {selectedProgram.type}
                  </CardDescription>
                </div>
                <Badge className={`${getMatchScoreColor(selectedProgram.matchScore)} text-sm font-bold`}>
                  {selectedProgram.matchScore}% Match
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Banknote className="h-5 w-5 text-success" />
                    Funding Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Amount:</span>
                      <span className="font-semibold">{selectedProgram.fundingAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Processing Time:</span>
                      <span>{selectedProgram.processingTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Deadline:</span>
                      <span>{selectedProgram.deadline}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className={getStatusColor(selectedProgram.status)}>
                        {selectedProgram.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-primary" />
                    Program Overview
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedProgram.description}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-success" />
                    Eligibility Requirements
                  </h3>
                  <ul className="space-y-2">
                    {selectedProgram.eligibility.map((req: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Award className="h-5 w-5 text-success" />
                    Key Benefits
                  </h3>
                  <ul className="space-y-2">
                    {selectedProgram.benefits.map((benefit: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-accent/50 p-6 rounded-lg mb-8">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  Application Guidance
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</div>
                    <div>
                      <strong>Prepare Documents:</strong> Gather SSM certificate, financial statements, business plan, and project proposal.
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</div>
                    <div>
                      <strong>Online Application:</strong> Complete the online application form through the official portal.
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</div>
                    <div>
                      <strong>Submit & Follow Up:</strong> Submit your application and track progress through the portal.
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button 
                  className="flex-1 bg-gradient-primary hover:opacity-90"
                  onClick={() => window.open(selectedProgram.applicationLink, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Apply Now
                </Button>
                <Button variant="outline" className="flex-1">
                  Save for Later
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Button 
            variant="outline" 
            onClick={onBack}
            className="mb-6 flex items-center gap-2 mx-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Assessment
          </Button>
          
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Your Grant Matches
          </h1>
          <p className="text-xl text-muted-foreground mb-4">
            Based on your business profile, we found {mockPrograms.length} relevant funding opportunities
          </p>
          
          <div className="bg-success/10 border border-success/20 rounded-lg p-4 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-success font-semibold">
              <CheckCircle className="h-5 w-5" />
              Analysis complete! Programs ranked by compatibility with {businessData?.companyName || 'your business'}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="grid gap-6 mb-8">
          {mockPrograms.map((program, index) => (
            <Card key={program.id} className="shadow-card hover:shadow-feature transition-all duration-300 border-0">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="outline" className="text-xs">
                        #{index + 1} Best Match
                      </Badge>
                      <Badge className={getMatchScoreColor(program.matchScore)}>
                        {program.matchScore}% Match
                      </Badge>
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-1">
                      {program.name}
                    </h3>
                    <p className="text-muted-foreground">
                      {program.provider} • {program.type}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-success">{program.fundingAmount}</div>
                    <div className={`text-sm ${getStatusColor(program.status)}`}>
                      {program.status}
                    </div>
                  </div>
                </div>

                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {program.description}
                </p>

                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Processing: {program.processingTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>Deadline: {program.deadline}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span>{program.provider}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    className="bg-gradient-primary hover:opacity-90"
                    onClick={() => setSelectedProgram(program)}
                  >
                    View Details
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => window.open(program.applicationLink, '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Quick Apply
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Additional Resources */}
        <Card className="shadow-feature border-0 bg-gradient-to-r from-accent/50 to-muted/50">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4 text-foreground">
              Need More Help?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Our AI will continue to monitor new grant opportunities and notify you when new matches become available.
            </p>
            <div className="flex justify-center gap-4">
              <Button variant="outline">
                Set Up Alerts
              </Button>
              <Button className="bg-gradient-primary hover:opacity-90">
                Schedule Consultation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};