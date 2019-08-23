export const navigation = [
  // {
  //   name: "Dashboard",
  //   url: "/dashboard",
  //   icon: "icon-speedometer"
  // },

  // {
  //   name: "StudioManagement",
  //   url: "/studio",
  //   icon: "icon-plus",
  //   children: [
  //     {
  //       name: "Studio",
  //       url: "/studio/studio",
  //       icon: "icon-minus",
  //       class: "font-italic small",
  //     }
  //   ]
  // },
  {
    name: "UserManagement",
    url: "/usermanager",
    icon: "icon-plus",
    children: [
      {
        name: "User",
        url: "/usermanagement/user",
        icon: "icon-minus",
        class: "font-italic small",
      },
      {
        name: "Role",
        url: "/usermanagement/role",
        icon: "icon-minus",
        class: "font-italic small",
      }
    ]
  },
  {
    name: "CampaignManager",
    url: "/campaignmanager",
    icon: "icon-plus",
    children: [
      {
        name: "Quick",
        url: "/campaignmanager/quick",
        icon: "icon-minus",
        class: "font-italic small",
      },
      {
        name: "Bulk",
        url: "/campaignmanager/bulk",
        icon: "icon-minus",
        class: "font-italic small",
      },
      {
        name: "Status",
        url: "/campaignmanager/campaignstatus",
        icon: "icon-minus",
        class: "font-italic small",
      },
      {
        name: "Details",
        url: "/campaignmanager/campaigndetails",
        icon: "icon-minus",
        class: "font-italic small",
      }
    ]
  },
  {
    name: "Reports",
    url: "/reports",
    icon: "icon-plus",
    children: [
      // {
      //   name: "Summary",
      //   url: "/reports/summary",
      //   icon: "icon-minus",
      //   class: "font-italic small",
      // },
      // {
      //   name: "Detailed",
      //   url: "/reports/detailed",
      //   icon: "icon-minus",
      //   class: "font-italic small",
      // },
      // {
      //   name: "Calltracking",
      //   url: "/reports/calltracking",
      //   icon: "icon-minus",
      //   class: "font-italic small",
      // },
      {
        name: "CdrDetails",
        url: "/reports/cdrdetails",
        icon: "icon-minus",
        class: "font-italic small",
      }
    ]
  },

];

export const usernavigation = [
   {
    name: "CampaignManager",
    url: "/campaignmanager",
    icon: "icon-plus",
    children: [
      {
        name: "Quick",
        url: "/campaignmanager/quick",
        icon: "icon-minus",
        class: "font-italic small",
      },
      {
        name: "Bulk",
        url: "/campaignmanager/bulk",
        icon: "icon-minus",
        class: "font-italic small",
      },
      {
        name: "Status",
        url: "/campaignmanager/campaignstatus",
        icon: "icon-minus",
        class: "font-italic small",
      },
      {
        name: "Details",
        url: "/campaignmanager/campaigndetails",
        icon: "icon-minus",
        class: "font-italic small",
      }
    ]
  },
  {
    name: "Reports",
    url: "/reports",
    icon: "icon-plus",
    children: [
      {
        name: "CdrDetails",
        url: "/reports/cdrdetails",
        icon: "icon-minus",
        class: "font-italic small",
      }
    ]
  },

];

export const moderatornavigation = [
  {
    name: "Reports",
    url: "/reports",
    icon: "icon-plus",
    children: [
      {
        name: "CdrDetails",
        url: "/reports/cdrdetails",
        icon: "icon-minus",
        class: "font-italic small",
      }
    ]
  },
]
