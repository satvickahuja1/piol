"use client";

import {
  ChevronDown,
  CreditCardIcon,
  FolderOpenIcon,
  HistoryIcon,
  KeyIcon,
  LogOutIcon,
  StarIcon,
  User2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../../components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

const menuItems = [
  {
    name: "home",
    value: [
      {
        name: "workflows",
        source: "/workflows",
        icon: FolderOpenIcon,
      },
      {
        name: "credentials",
        source: "/credentials",
        icon: CreditCardIcon,
      },
      {
        name: "execution",
        source: "/execution",
        icon: HistoryIcon,
      },
    ],
  },
];

const EditorHeader = ({workflowId}:{workflowId:string}) => {
  const trpc = useTRPC();
  const pathname = usePathname();
  const res = useQuery(
    trpc.checkSubs.queryOptions(undefined, {
      retry: false,
    }),
  );
  if (res.isError) {
    if (res.error.data?.code == "FORBIDDEN") {
      toast.error("not subscribed to services");
    }
  }
 if(res.isSuccess){
  console.log(res.data)
 }

  return (
    <Sidebar>
      <SidebarContent>
        {menuItems.map((group) => (
          <SidebarGroup key={group.name}>
            <SidebarGroupContent className="px-2 py-2">
              <SidebarMenu className="space-y-2">
                {group.value.map((item) => {
                  const isActive = pathname === item.source;

                  return (
                    <SidebarMenuItem className="" key={item.name}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link
                          href={item.source}
                          className="flex items-center gap-x-4 w-full"
                        >
                          <item.icon className="size-4" />
                          <span className="capitalize">{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              {res.isPending && <p>Loading..</p>}
              {res.isError && (
                <Button
                  onClick={async () => {
                    await authClient.checkout({ slug: "pro" });
                  }}
                >
                  Upgrade to pro
                </Button>
              )}
              {res.data && <p>{res.data.status}</p>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

import { useSidebar } from "@/components/ui/sidebar";
import { Menu } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { TRPCClientError } from "@trpc/client";
import { toast } from "sonner";
import { Button } from "../../../components/ui/button";

function SidebarToggleButton() {
  const { toggleSidebar } = useSidebar();

  return (
    <button onClick={toggleSidebar}>
      <Menu />
    </button>
  );
}

export { EditorHeader, SidebarToggleButton };
