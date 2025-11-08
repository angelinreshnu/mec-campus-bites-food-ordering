import Navigation from "@/components/Navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Users, Award, Heart } from "lucide-react";

export default function AboutPage() {
  const features = [
    {
      icon: Clock,
      title: "Save Time",
      description: "Order ahead and skip the long queues during peak hours",
    },
    {
      icon: Users,
      title: "For Students",
      description: "Built specifically for MEC students and staff by understanding campus needs",
    },
    {
      icon: Award,
      title: "Quality Food",
      description: "Traditional South Indian recipes made with fresh ingredients daily",
    },
    {
      icon: Heart,
      title: "Campus Community",
      description: "Supporting local vendors and bringing the campus community together",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/20">
      <Navigation />

      <div className="container px-4 py-8 md:py-12">
        {/* Hero Section */}
        <div className="max-w-4xl mx-auto text-center space-y-6 mb-16">
          <div className="relative w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary via-secondary to-primary p-1 shadow-2xl">
            <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary">MEC</div>
                <div className="text-sm text-muted-foreground">1949</div>
              </div>
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold">
            About{" "}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Campus Bites
            </span>
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed">
            Campus Bites is the official food ordering platform for Madras Engineering College,
            designed to make campus dining convenient, efficient, and enjoyable for all students
            and staff members.
          </p>
        </div>

        {/* Story Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="border-2">
            <CardContent className="p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>
                  Founded in 1949, Madras Engineering College has been a cornerstone of technical
                  education in India. With thousands of students on campus every day, we recognized
                  the need for a modern, efficient food ordering system.
                </p>
                <p>
                  Campus Bites was created to solve a simple problem: long queues during lunch breaks
                  and limited time between classes. Now, students can order their favorite South
                  Indian meals in advance and pick them up without waiting, ensuring they never miss
                  a meal or a class.
                </p>
                <p>
                  We partner with trusted campus canteens to bring you authentic South Indian
                  cuisine – from crispy dosas and soft idlis for breakfast to aromatic biryanis and
                  wholesome meals for lunch and dinner.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Why Choose Campus Bites?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:shadow-lg transition-shadow">
                <CardContent className="pt-6 text-center space-y-3">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-primary to-secondary text-white border-0 shadow-xl">
            <CardContent className="p-8 md:p-12 space-y-6">
              <h2 className="text-3xl font-bold">Our Commitment</h2>
              <ul className="space-y-3 text-lg opacity-90">
                <li className="flex items-start gap-3">
                  <span className="text-2xl">✓</span>
                  <span>Fresh, quality food prepared with hygiene standards</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">✓</span>
                  <span>Fair pricing accessible to all students</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">✓</span>
                  <span>Quick service to respect your academic schedule</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-2xl">✓</span>
                  <span>Continuous improvement based on student feedback</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Contact Section */}
        <div className="max-w-4xl mx-auto mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
          <p className="text-muted-foreground mb-4">
            Have questions or feedback? We'd love to hear from you!
          </p>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Email:</strong> campusbites@mec.edu.in
            </p>
            <p>
              <strong>Location:</strong> Madras Engineering College, Chennai
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
