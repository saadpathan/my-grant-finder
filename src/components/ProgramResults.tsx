import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, FileText, Award, Banknote, Clock, Building2, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";
import { BusinessProfile, GrantProgram } from "@/types";

interface ProgramResultsProps {
  businessData: {
    businessProfile: BusinessProfile;
    matches: { program: GrantProgram; matchScore: number; reasons: string[] }[];
  };
  onBack: () => void;
}

// Use real data from props instead of mock data

export const ProgramResults = ({ businessData, onBack }: ProgramResultsProps) => {
  const [selectedProgram, setSelectedProgram] = useState<{ program: GrantProgram; matchScore: number; reasons: string[] } | null>(null);
  const { businessProfile, matches } = businessData;

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
                  <CardTitle className="text-2xl mb-2">{selectedProgram.program.name}</CardTitle>
                  <CardDescription className="text-white/90">
                    {selectedProgram.program.provider} • {selectedProgram.program.type}
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
                      <span className="font-semibold">{selectedProgram.program.fundingAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Processing Time:</span>
                      <span>{selectedProgram.program.processingTime}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Deadline:</span>
                      <span>{selectedProgram.program.deadline}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className={getStatusColor(selectedProgram.program.status)}>
                        {selectedProgram.program.status}
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
                    {selectedProgram.program.description}
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
                    {selectedProgram.program.eligibility.map((req: string, index: number) => (
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
                    {selectedProgram.program.benefits.map((benefit: string, index: number) => (
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
                  onClick={() => window.open(selectedProgram.program.applicationLink, '_blank')}
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
            Based on your business profile, we found {matches.length} relevant funding opportunities
          </p>
          
          <div className="bg-success/10 border border-success/20 rounded-lg p-4 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-success font-semibold">
              <CheckCircle className="h-5 w-5" />
              Analysis complete! Programs ranked by compatibility with {businessProfile?.companyName || 'your business'}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="grid gap-6 mb-8">
          {matches.map((match, index) => (
            <Card key={match.program.id} className="shadow-card hover:shadow-feature transition-all duration-300 border-0">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge variant="outline" className="text-xs">
                        #{index + 1} Best Match
                      </Badge>
                      <Badge className={getMatchScoreColor(match.matchScore)}>
                        {match.matchScore}% Match
                      </Badge>
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-1">
                      {match.program.name}
                    </h3>
                    <p className="text-muted-foreground">
                      {match.program.provider} • {match.program.type}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-success">{match.program.fundingAmount}</div>
                    <div className={`text-sm ${getStatusColor(match.program.status)}`}>
                      {match.program.status}
                    </div>
                  </div>
                </div>

                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {match.program.description}
                </p>

                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Processing: {match.program.processingTime}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>Deadline: {match.program.deadline}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span>{match.program.provider}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button 
                    className="bg-gradient-primary hover:opacity-90"
                    onClick={() => setSelectedProgram(match)}
                  >
                    View Details
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => window.open(match.program.applicationLink, '_blank')}
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