
export const configuration = 
{
    "apps-settings": {
        "refresh-interval": 10*1000,
        "refresh-interval-clw": 10*1000,
        "refresh-interval-elastic": 5*1000,
        "api_url": "",
        "version" : "0.1.2",
        "application-title": "DBTop Monitoring Solution"
    }
};

export const SideMainLayoutHeader = { text: 'Database Services', href: '#/' };

export const SideMainLayoutMenu = [
    { type: "link", text: "Home", href: "/" },
    {
      text: 'Resources',
      type: 'section',
      defaultExpanded: true,
      items: [
        { type: 'link', text: 'RDS Instances', href: '/rds/instances/' },
        { type: 'link', text: 'Aurora Clusters', href: '#'},
        { type: 'link', text: 'ElastiCache Clusters', href: '/clusters/elasticache/' },
        { type: 'link', text: 'Memory Clusters', href: '/clusters/memorydb/'},
        { type: 'link', text: 'DocumentDB Clusters', href: '#'}
      ],
    },
    { type: "divider" },
    {
          type: "link",
          text: "Documentation",
          href: "https://github.com/aws-samples/rds-top-monitoring",
          external: true,
          externalIconAriaLabel: "Opens in a new tab"
    }
  ];


export const breadCrumbs = [{text: 'Service',href: '#',},{text: 'Resource search',href: '#',},];
  