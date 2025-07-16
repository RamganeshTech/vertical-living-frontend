import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Label } from '../../components/ui/Label';
import { Input } from '../../components/ui/Input';
import { Avatar, AvatarFallback } from '../../components/ui/Avatar';
import { toast } from '../../utils/toast';
import {  useOutletContext, useParams } from 'react-router-dom';
import { useGetClientByOrgsAndProject, useInviteClientToProject } from '../../apiList/orgApi';
import type { ProjectDetailsOutlet } from '../../types/types';

//   const dummyClients = [
//   {
//     "clientName": "Arun Kumar",
//     "email": "arun.kumar@example.com",
//     "phoneNo": "9876543210",
//     "projectId": "project123",
//     "ownerId": "ownerA"
//   },
//   {
//     "clientName": "Priya Raj",
//     "email": "priya.raj@example.com",
//     "phoneNo": "9876543211",
//     "projectId": "project123",
//     "ownerId": "ownerA"
//   },
//   {
//     "clientName": "Suresh",
//     "email": "arun.kumar@example.com",
//     "phoneNo": "9876543210",
//     "projectId": "project456",
//     "ownerId": "ownerA"
//   },
//   {
//     "clientName": "Meena",
//     "email": "meena@example.com",
//     "phoneNo": "9998887777",
//     "projectId": "project456",
//     "ownerId": "ownerA"
//   },
//    {
//     "clientName": "Priya Raj",
//     "email": "priya.raj@example.com",
//     "phoneNo": "9876543211",
//     "projectId": "project123",
//     "ownerId": "ownerA"
//   },
//   {
//     "clientName": "Suresh",
//     "email": "arun.kumar@example.com",
//     "phoneNo": "9876543210",
//     "projectId": "project456",
//     "ownerId": "ownerA"
//   },
//   {
//     "clientName": "Meena",
//     "email": "meena@example.com",
//     "phoneNo": "9998887777",
//     "projectId": "project456",
//     "ownerId": "ownerA"
//   }
// ]

const InviteClient: React.FC = () => {
  const { projectId, organizationId } = useParams<{ projectId: string; organizationId: string }>();
  const [inviteLink, setInviteLink] = useState('');
  const [copied, setCopied] = useState(false);
  const {openMobileSidebar , isMobile} = useOutletContext<ProjectDetailsOutlet>()

  const inviteClient = useInviteClientToProject();
  const { data: clients, isLoading, isError } = useGetClientByOrgsAndProject(organizationId!, projectId!);

  const handleGenerateInviteLink = async () => {
    try {
      const response = await inviteClient.mutateAsync({ projectId: projectId! , organizationId:organizationId!});
      setInviteLink(response.inviteLink || response);
      toast({ title: 'Success', description: 'Invitation link generated successfully' });
    } catch (error: any) {
      toast({ title: 'Error', description: error?.response?.data?.message || 'Failed to generate invitation link', variant: 'destructive' });
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      toast({ title: 'Success', description: 'Link copied to clipboard' });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to copy link', variant: 'destructive' });
    }
  };

  const handleShareWhatsApp = () => {
    const message = `You're invited to join in the project! Click this link to register: ${inviteLink}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const getInitials = (name: string) => name?.split(' ').map(n => n[0])?.join('')?.toUpperCase();



  return (
    <div className="min-h-full min-w-full ">
      
      <div className="mb-3">
        <div className="max-w-full mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Left Section */}
            <div className="flex items-center space-x-4 min-w-0 flex-1">
               {isMobile && (
                  <button
                    onClick={openMobileSidebar}
                    className="mr-3 p-2 rounded-md border border-gray-300 hover:bg-gray-100"
                    title="Open Menu"
                  >
                    <i className="fa-solid fa-bars "></i>
                  </button>
                )} 

              <div className="hidden sm:block  w-px bg-gray-300 flex-shrink-0" />

              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 truncate">
                      <i className="fas fa-user-plus mr-1"></i>
                    Invite Client</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 w-full ">
        {/* Invitation box */}
        <div className="flex-1 border-l-4 border-blue-600  bg-white p-4 max-h-[45vh]  h-fit overflow-y-auto rounded-2xl shadow-lg space-y-6 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold text-blue-600 mb-2 flex items-center">
              Generate Client
            </h2>
            <p className="text-sm text-gray-600 mb-4">Invite a client by generating a link.</p>

            {!inviteLink ? (
              <Button
                onClick={handleGenerateInviteLink}
                isLoading={inviteClient.isPending}
                className="w-full bg-blue-600 text-white py-3"
              >
                <i className="fas fa-link mr-2" /> Generate Invitation Link
              </Button>
            ) : (
              <div className="space-y-4">
                <Label>Invitation Link</Label>
                <div className="flex items-center gap-2">
                  <Input value={inviteLink} readOnly className="bg-blue-50 text-blue-800 flex-1" />
                  <Button onClick={handleCopyLink}>
                    <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`} />
                  </Button>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleShareWhatsApp} className="w-full bg-green-600 text-white">
                    <i className="fab fa-whatsapp mr-2" /> Share on WhatsApp
                  </Button>
                  <Button onClick={handleCopyLink} className="w-full border border-blue-400 text-blue-700">
                    <i className="fas fa-copy mr-2" /> Copy
                  </Button>
                </div>
                <Button onClick={handleGenerateInviteLink} className="w-full bg-purple-600 text-white">
                  <i className="fas fa-sync-alt mr-2" /> Generate New Link
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Clients list */}
        <div className="flex-1 bg-white border-2 border-blue-200 p-6 rounded-2xl shadow-lg py-4 max-h-[70vh] sm:!max-h-[63vh] md:!max-h-[100vh]  lg:!max-h-[85vh] xl:!max-h-[90vh] overflow-y-auto custom-scrollbar">
          <h2 className="text-2xl font-bold text-blue-600 mb-4 flex items-center">
            <i className="fas fa-users mr-2" /> Clients ({clients?.length || 0})
          </h2>

          {isLoading ? (
            <p className="text-blue-700">Loading clients...</p>
          ) : isError ? (
            <p className="text-red-600">Failed to get clients.</p>
          ) : clients?.length === 0 ? (
            <div className="text-center text-blue-700 p-8">
              <i className="fas fa-user-slash text-3xl mb-2"></i>
              <p>No clients have been added yet.</p>
              <p className="text-sm">Generate a link to invite them.</p>
            </div>
          ) : (
            <div className="space-y-4 h-[85%]">
              {clients?.map((client: any) => (
                <div
                  key={client._id}
                  className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100 hover:shadow-md transition"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="w-12 h-12">
                      {/* <AvatarImage src={client.avatarUrl || COMPANY_DETAILS.COMPANY_LOGO} /> */}
                      <AvatarFallback className="bg-blue-600 text-white font-bold">{getInitials(client.clientName)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="text-blue-900 font-semibold">{client.clientName}</h4>
                      <p className="text-sm text-gray-600">
                        <i className="fas fa-envelope mr-1" /> {client.email}
                      </p>
                      {client.phoneNo && (
                        <p className="text-sm text-gray-600">
                          <i className="fas fa-phone-alt mr-1" /> {client.phoneNo}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InviteClient;
