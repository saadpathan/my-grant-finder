import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Building2, TrendingUp, FileText, ArrowRight, Users, Award, Banknote } from "lucide-react";
import { BusinessQuestionnaire } from "@/components/BusinessQuestionnaire";
import { ProgramResults } from "@/components/ProgramResults";
import heroImage from "@/assets/hero-bg.jpg";

const Index = () => {
  const [currentStep, setCurrentStep] = useState<'landing' | 'questionnaire' | 'results'>('landing');
  const [businessData, setBusinessData] = useState(null);

  const handleStartAssessment = () => {
    setCurrentStep('questionnaire');
  };

  const handleQuestionnaireComplete = (data: any) => {
    setBusinessData(data);
    setCurrentStep('results');
  };

  if (currentStep === 'questionnaire') {
    return <BusinessQuestionnaire onComplete={handleQuestionnaireComplete} />;
  }

  if (currentStep === 'results') {
    return <ProgramResults businessData={businessData} onBack={() => setCurrentStep('landing')} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section 
        className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(31, 81, 138, 0.9), rgba(220, 38, 38, 0.8)), url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-6 text-center text-white relative z-10">
          <Badge className="mb-6 bg-success text-success-foreground px-4 py-2 text-sm font-semibold">
            🇲🇾 Malaysia's #1 SME Grant Matching Platform
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Find Your Perfect
            <span className="block bg-gradient-success bg-clip-text text-transparent">
              Grant Match
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-95 leading-relaxed">
            Connect Malaysian SMEs with relevant government grants, bank funding programs, and financial opportunities. 
            AI-powered matching that understands your business needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button 
              size="lg" 
              onClick={handleStartAssessment}
              className="bg-white text-primary hover:bg-white/90 px-8 py-4 text-lg font-semibold shadow-button"
            >
              Start Free Assessment
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg"
            >
              View Success Stories
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-sm opacity-90">SMEs Matched</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">RM50M+</div>
              <div className="text-sm opacity-90">Funding Secured</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">98%</div>
              <div className="text-sm opacity-90">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Why Malaysian SMEs Choose MYMatch
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered platform simplifies grant discovery and application processes
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="p-8 shadow-feature hover:shadow-lg transition-all duration-300 border-0">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Smart Business Profiling</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base leading-relaxed">
                  Advanced questionnaire that understands your business model, industry, and growth stage
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="p-8 shadow-feature hover:shadow-lg transition-all duration-300 border-0">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-success/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-8 w-8 text-success" />
                </div>
                <CardTitle className="text-xl">AI-Powered Matching</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base leading-relaxed">
                  Gemini AI analyzes 200+ grant programs to find perfect matches for your business
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="p-8 shadow-feature hover:shadow-lg transition-all duration-300 border-0">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-secondary" />
                </div>
                <CardTitle className="text-xl">Application Guidance</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-base leading-relaxed">
                  Step-by-step guidance with requirements, documents, and direct application links
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Process Steps */}
          <div className="bg-gradient-to-r from-accent/50 to-muted/50 rounded-2xl p-12 mb-16">
            <h3 className="text-3xl font-bold text-center mb-12 text-foreground">
              How It Works
            </h3>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { icon: Users, title: "Business Profile", desc: "Answer questions about your SME" },
                { icon: TrendingUp, title: "AI Analysis", desc: "Our AI matches you with programs" },
                { icon: Award, title: "View Results", desc: "See tailored recommendations" },
                { icon: Banknote, title: "Apply & Succeed", desc: "Follow our guided application process" }
              ].map((step, index) => (
                <div key={index} className="text-center">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <step.icon className="h-10 w-10 text-primary" />
                  </div>
                  <h4 className="font-semibold text-lg mb-2 text-foreground">{step.title}</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-4 text-foreground">
              Ready to Unlock Your Business Potential?
            </h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join hundreds of Malaysian SMEs who have secured funding through our platform
            </p>
            <Button 
              size="lg" 
              onClick={handleStartAssessment}
              className="bg-gradient-primary hover:opacity-90 px-8 py-4 text-lg shadow-button"
            >
              Start Your Assessment Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;