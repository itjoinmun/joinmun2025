"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

type TeamMember = {
  name: string;
  email: string;
  institution: string;
  country: string;
  registrationProgress: number;
};

export function TeamRegistrationTable() {
  const router = useRouter();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load data from localStorage
    const loadTeamData = () => {
      try {
        setIsLoading(true);
        const storedData = localStorage.getItem("teamRegistration");
        
        if (!storedData) {
          setTeamMembers([]);
          setIsLoading(false);
          return;
        }
        
        const parsedData = JSON.parse(storedData);
        const members: TeamMember[] = [];
        
        // Process each team member from the structure
        Object.keys(parsedData).forEach((key) => {
          const member = parsedData[key];
          if (member.biodata_responses) {
            const email = member.mun_delegates?.mun_delegate_email || "";
            
            // Find name, institution and country from biodata_responses
            let name = "";
            let institution = "";
            let country = "";
            
            member.biodata_responses.forEach((response: any) => {
              if (response.biodata_question_id === 2) name = response.biodata_answer_text;
              if (response.biodata_question_id === 4) institution = response.biodata_answer_text;
              if (response.biodata_question_id === 5) country = response.biodata_answer_text;
            });
            
            // Calculate registration progress (simplified)
            const hasAllResponses = 
              member.biodata_responses.length > 0 && 
              member.mun_responses?.length > 0 && 
              member.health_responses?.length > 0;
            
            const registrationProgress = hasAllResponses ? 100 : 
              ((member.biodata_responses.length + 
                (member.mun_responses?.length || 0) + 
                (member.health_responses?.length || 0)) / 30) * 100;
            
            members.push({
              name,
              email,
              institution,
              country,
              registrationProgress: Math.min(Math.round(registrationProgress), 100)
            });
          }
        });
        
        setTeamMembers(members);
      } catch (error) {
        console.error("Error loading team data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTeamData();
    
    // Refresh data when localStorage changes
    const handleStorageChange = () => {
      loadTeamData();
    };
    
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
  
  const handleAddTeamMember = () => {
    // Navigate to registration form for a new member
    // We use the next available index
    const nextIndex = teamMembers.length;
    router.push(`/dashboard/delegates/team/registration/1?idx=${nextIndex}`);
  };
  
  const handleEditTeamMember = (index: number) => {
    router.push(`/dashboard/delegates/team/registration/1?idx=${index}`);
  };

  if (isLoading) {
    return <p>Loading team members...</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Team Members ({teamMembers.length})</h3>
        <Button onClick={handleAddTeamMember} className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Add Team Member
        </Button>
      </div>

      {teamMembers.length === 0 ? (
        <div className="py-6 text-center">
          <p className="text-muted-foreground">No team members registered yet.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Get started by adding your first team member.
          </p>
        </div>
      ) : (
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">No.</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {teamMembers.map((member, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{member.name || "—"}</TableCell>
                  <TableCell>{member.email || "—"}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditTeamMember(index)}
                    >
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}