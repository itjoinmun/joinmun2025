"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
type TeamMember = {
  name: string;
  originalIndex: number; // Keep track of original index in localStorage
};

export function TeamRegistrationTable() {
  const router = useRouter();
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTeamData = () => {
    try {
      setIsLoading(true);
      const storedData = localStorage.getItem("teamRegistration");

      if (!storedData) {
        setTeamMembers([]);
        return;
      }

      const parsedData = JSON.parse(storedData);
      console.log("📊 Parsed data structure:", parsedData); // Debug log

      const members: TeamMember[] = [];

      // Process each team member from the structure
      Object.keys(parsedData).forEach((key) => {
        const index = parseInt(key);
        const member = parsedData[key];

        console.log(`👤 Processing member at index ${index}:`, member); // Debug log

        if (member && member.biodata_responses) {
          // Find name from biodata_responses
          let name = "";

          /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
          member.biodata_responses.forEach((response: any) => {
            if (response.biodata_question_id === 2) name = response.biodata_answer_text;
          });

          if (name) {
            // Only add if we found a name
            members.push({
              name,
              originalIndex: index,
            });
          }
        }
      });

      console.log("✅ Final team members:", members); // Debug log
      setTeamMembers(members);
    } catch (error) {
      console.error("Error loading team data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Load data initially
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
    // Find the next available index
    const nextIndex =
      teamMembers.length > 0 ? Math.max(...teamMembers.map((m) => m.originalIndex)) + 1 : 0;
    router.push(`/dashboard/delegates/team/registration/1?idx=${nextIndex}`);
  };

  const handleEditTeamMember = (originalIndex: number) => {
    router.push(`/dashboard/delegates/team/registration/1?idx=${originalIndex}`);
  };

  const handleDeleteTeamMember = (originalIndex: number) => {
    try {
      // Retrieve current data from localStorage
      const storedData = localStorage.getItem("teamRegistration");

      if (!storedData) {
        return;
      }

      const parsedData = JSON.parse(storedData);

      // Delete the member entry
      if (parsedData[originalIndex]) {
        delete parsedData[originalIndex];

        // Save the updated data back to localStorage
        localStorage.setItem("teamRegistration", JSON.stringify(parsedData));

        // Update the state to reflect changes
        setTeamMembers(teamMembers.filter((member) => member.originalIndex !== originalIndex));

        // Trigger storage event for other components to reload data
        window.dispatchEvent(new Event("storage"));
      }
    } catch (error) {
      console.error("Error deleting team member:", error);
    }
  };

  if (isLoading) {
    return <p>Loading team members...</p>;
  }

  return (
    <div className="space-y-4">
      {teamMembers.length === 0 ? (
        <Table>
          <TableHeader className="*:bg-background border-none">
            <TableRow>
              <TableHead>Name</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="bg-neutral-600">
            <TableRow>
              <TableCell colSpan={3} className="text-center">
                <Button
                  onClick={handleAddTeamMember}
                  className="mx-auto flex items-center gap-2 bg-transparent"
                >
                  <UserPlus className="h-4 w-4" />
                  Add Team Member
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      ) : (
        <div className="bg-background rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="py-6">Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-neutral-600">
              {teamMembers.map((member) => (
                <TableRow key={member.originalIndex}>
                  <TableCell className="text-white">{member.name || "—"}</TableCell>
                  <TableCell className="text-right text-white">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditTeamMember(member.originalIndex)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteTeamMember(member.originalIndex)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              <TableRow>
                <TableCell colSpan={2} className="text-center">
                  <Button onClick={handleAddTeamMember} className="mx-auto flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Add Team Member
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
