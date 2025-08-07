import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code, Workflow } from "lucide-react";

const LogicLab = () => {
  return (
    <div className="min-h-screen bg-platform-gray/30">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-12 text-center fade-in">
          <h1 className="text-4xl font-bold text-primary mb-4">Logic Lab</h1>
          <p className="text-lg text-platform-gray-dark max-w-2xl mx-auto">
            Choose your preferred tool to practice and enhance your logical thinking skills
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* MR PSEUDO Card */}
          <Card className="card-elevated hover:scale-102 transition-all duration-300 bg-platform-orange-light border-2 border-transparent hover:border-accent/20">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="w-8 h-8 text-accent" />
              </div>
              <CardTitle className="text-2xl text-primary mb-2">
                MR PSEUDO
              </CardTitle>
              <p className="text-lg text-platform-gray-dark">
                The Pseudo Code Editor
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-platform-gray-dark">
                    Write. Validate. Improve Your Logic.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-platform-gray-dark">
                    Convert pseudo-code into executable logic with real-time feedback.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-platform-gray-dark">
                    Start building algorithmic thinking step by step.
                  </p>
                </div>
              </div>
              <Link to="/mr-pseudo">
                <Button className="w-full btn-accent group">
                  Start with MR PSEUDO
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* LADY LOGIC Card */}
          <Card className="card-elevated hover:scale-102 transition-all duration-300 bg-platform-blue-light border-2 border-transparent hover:border-primary/20">
            <CardHeader className="text-center pb-6">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Workflow className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl text-primary mb-2">
                LADY LOGIC
              </CardTitle>
              <p className="text-lg text-platform-gray-dark">
                The Flowchart Evaluator
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-platform-gray-dark">
                    Design. Analyze. Optimize.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-platform-gray-dark">
                    Drag & drop flowchart elements to visualize your logic flow.
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-platform-gray-dark">
                    Interactive evaluation with instant feedback on your diagrams.
                  </p>
                </div>
              </div>
              <Link to="/lady-logic">
                <Button className="w-full btn-primary group">
                  Explore LADY LOGIC
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LogicLab;