import { UserButton, useAuth } from "@clerk/react";
import { LogInIcon, ServerIcon, SmartphoneIcon } from "lucide-react";

import { hasCloudPublicConfig } from "../../cloud/publicConfig";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { MobileClientsUserProfilePage } from "./MobileClientsUserProfilePage";
import { AgentSmithConnectUserProfilePage } from "./AgentSmithConnectUserProfilePage";
import { useAgentSmithConnectAuthPrompt } from "./useAgentSmithConnectAuthPrompt";

export function AgentSmithConnectSidebarSignIn() {
  if (!hasCloudPublicConfig()) return null;

  return <ConfiguredAgentSmithConnectSidebarSignIn />;
}

export function AgentSmithConnectSidebarAvatar() {
  if (!hasCloudPublicConfig()) return null;

  return <ConfiguredAgentSmithConnectSidebarAvatar />;
}

function ConfiguredAgentSmithConnectSidebarAvatar() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded || !isSignedIn) return null;

  return (
    <UserButton
      appearance={{
        elements: {
          avatarBox: "size-7",
          userButtonTrigger: "rounded-lg p-1 hover:bg-sidebar-row-hover",
        },
      }}
    >
      <UserButton.UserProfilePage
        label="Mobile clients"
        labelIcon={<SmartphoneIcon className="size-4" />}
        url="mobile-clients"
      >
        <MobileClientsUserProfilePage />
      </UserButton.UserProfilePage>
      <UserButton.UserProfilePage
        label="AgentSmith Connect"
        labelIcon={<ServerIcon className="size-4" />}
        url="agentsmith-connect"
      >
        <AgentSmithConnectUserProfilePage />
      </UserButton.UserProfilePage>
    </UserButton>
  );
}

function ConfiguredAgentSmithConnectSidebarSignIn() {
  const { isLoaded, isSignedIn } = useAuth();
  const { authPrompt, openAuthPrompt } = useAgentSmithConnectAuthPrompt();

  if (!isLoaded || isSignedIn) return null;

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton onClick={openAuthPrompt}>
            <LogInIcon />
            <span>Sign in to AgentSmith Connect</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
      {authPrompt}
    </>
  );
}
