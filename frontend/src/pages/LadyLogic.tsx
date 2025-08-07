import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Play, Save, Download, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface FlowchartElement {
  id: string;
  type: "oval" | "rectangle" | "diamond" | "parallelogram";
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
}

interface Connection {
  id: string;
  from: string;
  to: string;
}

const LadyLogic = () => {
  const [elements, setElements] = useState<FlowchartElement[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState<string | null>(null);
  const [draggedType, setDraggedType] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const toolboxItems = [
    { type: "oval", icon: "⭕", label: "Start/End", tooltip: "Drag me to canvas" },
    { type: "rectangle", icon: "▭", label: "Process", tooltip: "Drag me to canvas" },
    { type: "diamond", icon: "◇", label: "Decision", tooltip: "Drag me to canvas" },
    { type: "parallelogram", icon: "▱", label: "Input/Output", tooltip: "Drag me to canvas" },
  ];

  const handleDragStart = (type: string) => {
    setDraggedType(type);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedType || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newElement: FlowchartElement = {
      id: `element-${Date.now()}`,
      type: draggedType as any,
      x: Math.max(0, x - 50),
      y: Math.max(0, y - 25),
      width: 100,
      height: 50,
      label: "New Element",
    };

    setElements(prev => [...prev, newElement]);
    setDraggedType(null);
    toast.success("Element added to canvas!");
  };

  const handleElementClick = (elementId: string) => {
    if (selectedElement === elementId) {
      setEditingLabel(elementId);
    } else {
      setSelectedElement(elementId);
    }
  };

  const handleLabelChange = (elementId: string, newLabel: string) => {
    setElements(prev =>
      prev.map(el =>
        el.id === elementId ? { ...el, label: newLabel } : el
      )
    );
  };

  const handleRun = async () => {
    if (elements.length === 0) {
      toast.error("Please add some flowchart elements first!");
      return;
    }

    setIsRunning(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockOutput = `Evaluating flowchart...
✓ Structure validation passed
✓ Logic flow analyzed
✓ Connection integrity verified

Analysis Results:
-----------------
Total Elements: ${elements.length}
Connections: ${connections.length}
Flow Type: Sequential Logic
Completeness: ${elements.some(e => e.type === 'oval') ? 'Complete' : 'Missing Start/End'}

Evaluation: Your flowchart demonstrates good logical structure!
No logical errors detected.`;
      
      setOutput("");
      let i = 0;
      const typeWriter = () => {
        if (i < mockOutput.length) {
          setOutput(prev => prev + mockOutput.charAt(i));
          i++;
          setTimeout(typeWriter, 25);
        }
      };
      typeWriter();
      
      toast.success("Flowchart evaluated successfully!");
    } catch (error) {
      setOutput("Error: Failed to evaluate flowchart. Please try again.");
      toast.error("Evaluation failed!");
    } finally {
      setIsRunning(false);
    }
  };

  const clearCanvas = () => {
    setElements([]);
    setConnections([]);
    setSelectedElement(null);
    setEditingLabel(null);
    setOutput("");
    toast.success("Canvas cleared!");
  };

  const renderElement = (element: FlowchartElement) => {
    const isSelected = selectedElement === element.id;
    const isEditing = editingLabel === element.id;

    let pathData = "";
    switch (element.type) {
      case "oval":
        pathData = `M ${element.x} ${element.y + element.height/2} 
                   Q ${element.x} ${element.y} ${element.x + element.width/2} ${element.y} 
                   Q ${element.x + element.width} ${element.y} ${element.x + element.width} ${element.y + element.height/2} 
                   Q ${element.x + element.width} ${element.y + element.height} ${element.x + element.width/2} ${element.y + element.height} 
                   Q ${element.x} ${element.y + element.height} ${element.x} ${element.y + element.height/2} Z`;
        break;
      case "diamond":
        pathData = `M ${element.x + element.width/2} ${element.y} 
                   L ${element.x + element.width} ${element.y + element.height/2} 
                   L ${element.x + element.width/2} ${element.y + element.height} 
                   L ${element.x} ${element.y + element.height/2} Z`;
        break;
      case "parallelogram":
        pathData = `M ${element.x + 10} ${element.y} 
                   L ${element.x + element.width} ${element.y} 
                   L ${element.x + element.width - 10} ${element.y + element.height} 
                   L ${element.x} ${element.y + element.height} Z`;
        break;
      default: // rectangle
        pathData = `M ${element.x} ${element.y} 
                   L ${element.x + element.width} ${element.y} 
                   L ${element.x + element.width} ${element.y + element.height} 
                   L ${element.x} ${element.y + element.height} Z`;
    }

    return (
      <g key={element.id}>
        <path
          d={pathData}
          fill={isSelected ? "hsl(var(--accent))" : "white"}
          stroke={isSelected ? "hsl(var(--accent))" : "hsl(var(--primary))"}
          strokeWidth="2"
          className="cursor-pointer hover:fill-blue-50 transition-colors"
          onClick={() => handleElementClick(element.id)}
        />
        {isEditing ? (
          <foreignObject
            x={element.x + 5}
            y={element.y + element.height/2 - 10}
            width={element.width - 10}
            height="20"
          >
            <Input
              defaultValue={element.label}
              onBlur={(e) => {
                handleLabelChange(element.id, e.target.value);
                setEditingLabel(null);
              }}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleLabelChange(element.id, e.currentTarget.value);
                  setEditingLabel(null);
                }
              }}
              className="text-xs p-1 h-5"
              autoFocus
            />
          </foreignObject>
        ) : (
          <text
            x={element.x + element.width/2}
            y={element.y + element.height/2 + 4}
            textAnchor="middle"
            className="text-xs fill-current pointer-events-none"
            fill={isSelected ? "white" : "hsl(var(--primary))"}
          >
            {element.label}
          </text>
        )}
      </g>
    );
  };

  return (
    <div className="min-h-screen bg-platform-gray/30">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 text-center fade-in">
          <h1 className="text-3xl font-bold text-primary mb-2">
            LADY LOGIC – The Flowchart Evaluator
          </h1>
          <p className="text-platform-gray-dark">
            Design, analyze, and optimize your logic flow with interactive flowcharts
          </p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Toolbox */}
          <div className="col-span-12 lg:col-span-2">
            <Card className="card-elevated sticky top-24">
              <CardHeader>
                <CardTitle className="text-primary text-lg">Toolbox</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {toolboxItems.map((item) => (
                  <div
                    key={item.type}
                    draggable
                    onDragStart={() => handleDragStart(item.type)}
                    className="p-3 border border-border rounded-lg cursor-move hover:bg-platform-gray/50 transition-colors group"
                    title={item.tooltip}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-1">{item.icon}</div>
                      <div className="text-xs text-platform-gray-dark group-hover:text-primary">
                        {item.label}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Canvas */}
          <div className="col-span-12 lg:col-span-6">
            <Card className="card-elevated">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-primary">Canvas</CardTitle>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={clearCanvas}>
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Save className="w-4 h-4" />
                  </Button>
                  <Button 
                    className="btn-accent" 
                    size="sm" 
                    onClick={handleRun}
                    disabled={isRunning}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {isRunning ? "Running..." : "RUN"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div
                  ref={canvasRef}
                  className="w-full h-[600px] bg-white border border-border rounded-lg relative overflow-hidden"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  style={{
                    backgroundImage: `radial-gradient(circle, #e2e8f0 1px, transparent 1px)`,
                    backgroundSize: '20px 20px'
                  }}
                >
                  <svg className="w-full h-full absolute inset-0">
                    {elements.map(renderElement)}
                  </svg>
                  {elements.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center text-platform-gray-dark">
                      <div className="text-center">
                        <div className="text-4xl mb-4">🎯</div>
                        <p>Drag elements from the toolbox to start building your flowchart</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Output */}
          <div className="col-span-12 lg:col-span-4">
            <Card className="card-elevated">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-primary">Output</CardTitle>
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="min-h-[600px] p-4 bg-platform-gray/30 rounded-lg border">
                  {output ? (
                    <pre className="text-sm font-mono whitespace-pre-wrap text-foreground">
                      {output}
                    </pre>
                  ) : (
                    <div className="flex items-center justify-center h-full text-platform-gray-dark">
                      <div className="text-center">
                        <Play className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Evaluate the flowchart to view results or errors here.</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LadyLogic;