// import React, { useState } from 'react';
// import { Button } from '../../components/ui/Button';
// import { Label } from '../../components/ui/Label';
// import { Input } from '../../components/ui/Input';
// import { Avatar, AvatarFallback } from '../../components/ui/Avatar';
// import { toast } from '../../utils/toast';
// import { useOutletContext, useParams } from 'react-router-dom';
// import { useGetClientByOrgsAndProject, useInviteClientToProject } from '../../apiList/organization_api/orgApi';
// import type { ProjectDetailsOutlet } from '../../types/types';
// import { useAuthCheck } from '../../Hooks/useAuthCheck';
// import StageGuide from '../../shared/StageGuide';

// const InviteClient: React.FC = () => {
//   const { projectId, organizationId } = useParams<{ projectId: string; organizationId: string }>();
//   const [inviteLink, setInviteLink] = useState('');
//   const [copied, setCopied] = useState(false);
//   const { openMobileSidebar, isMobile } = useOutletContext<ProjectDetailsOutlet>()

//   const inviteClient = useInviteClientToProject();
//   const { data: clients, isLoading, isError } = useGetClientByOrgsAndProject(organizationId!, projectId!);



//   const { role, permission } = useAuthCheck();
//   // const canDelete = role === "owner" || permission?.inviteclient?.delete;
//   const canList = role === "owner" || permission?.inviteclient?.list;
//   const canCreate = role === "owner" || permission?.inviteclient?.create;
//   const canEdit = role === "owner" || permission?.inviteclient?.edit;

//   const handleGenerateInviteLink = async () => {
//     try {
//       const response = await inviteClient.mutateAsync({ projectId: projectId!, organizationId: organizationId! });
//       setInviteLink(response.inviteLink || response);
//       toast({ title: 'Success', description: 'Invitation link generated successfully' });
//     } catch (error: any) {
//       toast({ title: 'Error', description: error?.response?.data?.message || 'Failed to generate invitation link', variant: 'destructive' });
//     }
//   };

//   const handleCopyLink = async () => {
//     try {
//       await navigator.clipboard.writeText(inviteLink);
//       setCopied(true);
//       toast({ title: 'Success', description: 'Link copied to clipboard' });
//       setTimeout(() => setCopied(false), 2000);
//     } catch (_error) {
//       toast({ title: 'Error', description: 'Failed to copy link', variant: 'destructive' });
//     }
//   };

//   const handleShareWhatsApp = () => {
//     const message = `You're invited to join in the project! Click this link to register: ${inviteLink}`;
//     const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
//     window.open(whatsappUrl, '_blank');
//   };

//   const getInitials = (name: string) => name?.split(' ').map(n => n[0])?.join('')?.toUpperCase();



//   return (
//     <div className="min-h-full min-w-full ">

//       <div className="mb-3">
//         <div className="max-w-full mx-auto">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//             {/* Left Section */}
//             <div className="flex items-center space-x-4 min-w-0 flex-1">
//               {isMobile && (
//                 <button
//                   onClick={openMobileSidebar}
//                   className="mr-3 p-2 rounded-md border border-gray-300 hover:bg-gray-100"
//                   title="Open Menu"
//                 >
//                   <i className="fa-solid fa-bars "></i>
//                 </button>
//               )}

//               <div className="hidden sm:block  w-px bg-gray-300 flex-shrink-0" />

//               <div className="flex items-center space-x-3 min-w-0 flex-1">
//                 <div className="min-w-0 flex-1">
//                   <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 truncate">
//                     <i className="fas fa-user-plus mr-1"></i>
//                     Invite Client</h1>
//                 </div>
//               </div>
//             </div>


//             <div className="w-full sm:w-auto flex justify-end sm:block">
//               <StageGuide
//                 organizationId={organizationId!}
//                 stageName="inviteclient"
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="flex flex-col lg:flex-row gap-6 w-full ">
//         {/* Invitation box */}
//         <div className="flex-1 border-l-4 border-blue-600  bg-white p-4 max-h-[45vh]  h-fit overflow-y-auto rounded-2xl shadow-lg space-y-6 flex flex-col justify-between">
//           <div>
//             <h2 className="text-2xl font-bold text-blue-600 mb-2 flex items-center">
//               Generate Client
//             </h2>
//             <p className="text-sm text-gray-600 mb-4">Invite a client by generating a link.</p>

//             {!inviteLink ? (
//               <>
//                 {(canCreate || canEdit) && <Button
//                   onClick={handleGenerateInviteLink}
//                   isLoading={inviteClient.isPending}
//                   className="w-full bg-blue-600 text-white py-3"
//                 >
//                   <i className="fas fa-link mr-2" /> Generate Invitation Link
//                 </Button>}</>
//             ) : (
//               <div className="space-y-4">
//                 <Label>Invitation Link</Label>
//                 <div className="flex items-center gap-2">
//                   <Input value={inviteLink} readOnly className="bg-blue-50 text-blue-800 flex-1" />
//                   <Button onClick={handleCopyLink}>
//                     <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`} />
//                   </Button>
//                 </div>
//                 <div className="flex gap-2">
//                   <Button onClick={handleShareWhatsApp} className="w-full bg-green-600 text-white">
//                     <i className="fab fa-whatsapp mr-2" /> Share on WhatsApp
//                   </Button>
//                   <Button onClick={handleCopyLink} className="w-full border border-blue-400 text-blue-700">
//                     <i className="fas fa-copy mr-2" /> Copy
//                   </Button>
//                 </div>
//                 {(canCreate || canEdit) && <Button onClick={handleGenerateInviteLink} className="w-full bg-purple-600 text-white">
//                   <i className="fas fa-sync-alt mr-2" /> Generate New Link
//                 </Button>}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Clients list */}
//         {canList && <div className="flex-1 bg-white border-2 border-blue-200 p-6 rounded-2xl shadow-lg py-4 max-h-[70vh] sm:!max-h-[63vh] md:!max-h-[100vh]  lg:!max-h-[85vh] xl:!max-h-[90vh] overflow-y-auto custom-scrollbar">
//           <h2 className="text-2xl font-bold text-blue-600 mb-4 flex items-center">
//             <i className="fas fa-users mr-2" /> Clients ({clients?.length || 0})
//           </h2>

//           {isLoading ? (
//             <p className="text-blue-700">Loading clients...</p>
//           ) : isError ? (
//             <p className="text-red-600">Failed to get clients.</p>
//           ) : clients?.length === 0 ? (
//             <div className="text-center text-blue-700 p-8">
//               <i className="fas fa-user-slash text-3xl mb-2"></i>
//               <p>No clients have been added yet.</p>
//               <p className="text-sm">Generate a link to invite them.</p>
//             </div>
//           ) : (
//             <div className="space-y-4 h-[85%]">
//               {clients?.map((client: any) => (
//                 <div
//                   key={client._id}
//                   className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100 hover:shadow-md transition"
//                 >
//                   <div className="flex items-center gap-4">
//                     <Avatar className="w-12 h-12">
//                       {/* <AvatarImage src={client.avatarUrl || COMPANY_DETAILS.COMPANY_LOGO} /> */}
//                       <AvatarFallback className="bg-blue-600 text-white font-bold">{getInitials(client.clientName)}</AvatarFallback>
//                     </Avatar>
//                     <div>
//                       <h4 className="text-blue-900 font-semibold">{client.clientName}</h4>
//                       <p className="text-sm text-gray-600">
//                         <i className="fas fa-envelope mr-1" /> {client.email}
//                       </p>
//                       {client.phoneNo && (
//                         <p className="text-sm text-gray-600">
//                           <i className="fas fa-phone-alt mr-1" /> {client.phoneNo}
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>}
//       </div>
//     </div>
//   );
// };

// export default InviteClient;




import React, { useState } from 'react';
import { Button } from '../../components/ui/Button';
import { Label } from '../../components/ui/Label';
import { Input } from '../../components/ui/Input';
import { Avatar, AvatarFallback } from '../../components/ui/Avatar';
import { toast } from '../../utils/toast';
import { useOutletContext, useParams } from 'react-router-dom';
import { useGetClientByOrgsAndProject, useInviteClientToProject } from '../../apiList/organization_api/orgApi';
import type { ProjectDetailsOutlet } from '../../types/types';
import { useAuthCheck } from '../../Hooks/useAuthCheck';
import StageGuide from '../../shared/StageGuide';

const InviteClient: React.FC = () => {
  const { projectId, organizationId } = useParams<{ projectId: string; organizationId: string }>();
  const [inviteLink, setInviteLink] = useState('');
  const [copied, setCopied] = useState(false);
  const { openMobileSidebar, isMobile } = useOutletContext<ProjectDetailsOutlet>()

  const inviteClient = useInviteClientToProject();
  const { data: clients, isLoading, isError } = useGetClientByOrgsAndProject(organizationId!, projectId!);

  const { role, permission } = useAuthCheck();
  // const canDelete = role === "owner" || permission?.inviteclient?.delete;
  const canList = role === "owner" || permission?.inviteclient?.list;
  const canCreate = role === "owner" || permission?.inviteclient?.create;
  const canEdit = role === "owner" || permission?.inviteclient?.edit;

  const handleGenerateInviteLink = async () => {
    try {
      const response = await inviteClient.mutateAsync({ projectId: projectId!, organizationId: organizationId! });
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
    } catch (_error) {
      toast({ title: 'Error', description: 'Failed to copy link', variant: 'destructive' });
    }
  };

  const handleShareWhatsApp = () => {
    const message = `You're invited to join in the project! Click this link to register: ${inviteLink}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const getInitials = (name: string) => name?.split(' ')?.map(n => n[0])?.join('')?.toUpperCase() || 'C';

  return (
    <div className="min-h-full min-w-full bg-brand-surface flex flex-col p-2 sm:p-4">

      {/* Header Section */}
      <div className="mb-6">
        <div className="max-w-full mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-ash-light pb-4">
            
            {/* Left Section */}
            <div className="flex items-center space-x-4 min-w-0 flex-1">
              {isMobile && (
                <button
                  onClick={openMobileSidebar}
                  className="mr-1 p-2 rounded-lg border border-ash-medium bg-brand-surface text-text-muted hover:bg-brand-ash shadow-sm transition-colors"
                  title="Open Menu"
                >
                  <i className="fa-solid fa-bars text-base"></i>
                </button>
              )}

              <div className="flex items-center space-x-3 min-w-0 flex-1">
               <div className="min-w-0 flex-1 flex items-center">
                  <div className="w-10 h-10 bg-brand-surface border border-ash-medium rounded-lg flex items-center justify-center shadow-sm mr-3">
                    <i className="fas fa-user-plus text-text-muted text-lg"></i>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold text-text-main truncate leading-tight">
                    Invite Client
                  </h1>
                </div> 
              </div>
            </div>

            {/* Right Section */}
            <div className="w-full sm:w-auto flex justify-end sm:block shrink-0">
              <StageGuide
                organizationId={organizationId!}
                stageName="inviteclient"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout - 35% / 65% Split */}
      <div className="flex flex-col lg:flex-row gap-6 w-full max-w-full">
        
        {/* Left Side: Invitation Controls (35% width) */}
        <div className="w-full lg:w-[35%] shrink-0 flex flex-col gap-6">
          <div className="bg-brand-surface p-5 lg:p-6 rounded-xl shadow-sm border border-ash-medium flex flex-col">
            
            <div className="border-b border-ash-light pb-4 mb-5">
              <h2 className="text-lg font-bold text-text-main flex items-center">
                <i className="fa-solid fa-link mr-2 text-text-muted"></i> Generate Client Link
              </h2>
              <p className="text-xs text-text-muted mt-1">Create a unique link to invite a client to this project workspace.</p>
            </div>

            {!inviteLink ? (
              <div className="py-4">
                {(canCreate || canEdit) && (
                  <Button
                    variant="dark"
                    onClick={handleGenerateInviteLink}
                    isLoading={inviteClient.isPending}
                    className="w-full py-2.5 shadow-sm"
                  >
                    Generate Invitation Link
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-5">
                <div>
                  <Label className="text-[11px] font-bold uppercase tracking-wider text-text-muted mb-1.5 block">Invitation Link</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      value={inviteLink} 
                      readOnly 
                      className="bg-brand-ash border border-ash-medium text-text-main flex-1 focus:ring-0 shadow-sm" 
                    />
                    <Button 
                      variant="dark" 
                      onClick={handleCopyLink} 
                      className="px-4 shadow-sm"
                    >
                      <i className={`fas ${copied ? 'fa-check text-action-success' : 'fa-copy'}`} />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col gap-2.5 pt-2 border-t border-gray-100">
                  <Button 
                    variant="white" 
                    onClick={handleShareWhatsApp} 
                    // className="w-full justify-center"
                    className="w-full justify-center border-ash-medium text-text-main hover:bg-brand-ash shadow-sm transition-colors"
                  >
                    {/* <i className="fab fa-whatsapp text-emerald-500 text-base mr-2" /> Share on WhatsApp */}
                    <i className="fab fa-whatsapp text-emerald-500 text-base mr-2" /> Share on WhatsApp
                  </Button>
                  
                  {(canCreate || canEdit) && (
                    <Button 
                      variant="ghost" 
                      onClick={handleGenerateInviteLink} 
                      // className="w-full justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-50 mt-2"
                      className="w-full justify-center text-text-muted hover:text-text-main hover:bg-brand-ash mt-2 transition-colors"
                    >
                      <i className="fas fa-rotate-right mr-2" /> Generate New Link
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Clients List (65% width) */}
        {canList && (
          <div className="w-full lg:w-[65%] flex flex-col bg-brand-surface border border-ash-medium rounded-xl shadow-sm h-fit max-h-[85vh] overflow-hidden">
            
            <div className="p-5 border-b border-ash-medium bg-brand-ash flex items-center justify-between">
              <h2 className="text-base font-bold text-text-main flex items-center">
                <i className="fas fa-users mr-2 text-text-muted" /> Active Clients
              </h2>
              <span className="bg-brand-surface border border-ash-medium text-text-main text-xs font-bold px-2.5 py-0.5 rounded-full">
                {clients?.length || 0}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-5">
              {isLoading ? (
                // <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <div className="flex flex-col items-center justify-center py-12 text-text-muted">
                  <i className="fas fa-circle-notch fa-spin text-2xl mb-3"></i>
                  <p className="text-sm font-medium">Loading clients...</p>
                </div>
              ) : isError ? (
                <div className="flex flex-col items-center justify-center py-12 text-action-danger">
                  <i className="fas fa-triangle-exclamation text-3xl mb-3"></i>
                  <p className="text-sm font-medium">Failed to load clients.</p>
                </div>
              ) : clients?.length === 0 ? (
                // <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                //   <div className="w-16 h-16 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center mb-4 shadow-sm">
                //     <i className="fas fa-user-slash text-2xl text-gray-300"></i>
                //   </div>
                //   <h3 className="text-gray-700 font-bold text-lg mb-1">No clients added yet</h3>
                //   <p className="text-gray-500 text-sm">Generate and share an invitation link to add clients to this project.</p>
                // </div>

                <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-ash-medium rounded-xl bg-brand-ash/30">
                  <div className="w-16 h-16 bg-brand-surface border border-ash-light rounded-full flex items-center justify-center mb-4 shadow-sm">
                    <i className="fas fa-user-slash text-2xl text-ash-dark"></i>
                  </div>
                  <h3 className="text-text-main font-bold text-lg mb-1">No clients added yet</h3>
                  <p className="text-text-muted text-sm font-medium">Generate and share an invitation link to add clients to this project.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {clients?.map((client: any) => (
                    <div
                      key={client._id}
                      className="flex items-center p-4 bg-brand-surface rounded-xl border border-ash-medium shadow-sm hover:shadow-md hover:border-text-muted transition-all group"
                    >
                      <Avatar className="w-12 h-12 mr-4 border border-ash-light shadow-sm">
                        {/* <AvatarImage src={client.avatarUrl || COMPANY_DETAILS.COMPANY_LOGO} /> */}
                        <AvatarFallback className="bg-action-primary text-white font-bold text-sm tracking-wider">
                          {getInitials(client.clientName)}
                        </AvatarFallback>
                      </Avatar>
                      
                    <div className="flex-1 min-w-0">
                        <h4 className="text-text-main font-bold text-sm truncate mb-1 group-hover:text-action-primary transition-colors">{client.clientName}</h4>
                        
                        <div className="flex flex-col gap-1.5">
                          <p className="text-[11px] font-bold text-text-muted truncate flex items-center">
                            <i className="fas fa-envelope mr-2 text-ash-dark w-3 text-center" /> 
                            {client.email}
                          </p>
                          {client.phoneNo && (
                            <p className="text-[11px] font-bold text-text-muted truncate flex items-center">
                              <i className="fas fa-phone-alt mr-2 text-ash-dark w-3 text-center" /> 
                              {client.phoneNo}
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
        )}
      </div>
    </div>
  );
};

export default InviteClient;