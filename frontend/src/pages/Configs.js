
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

export const SideMainLayoutHeader = { text: 'Service', href: '#/' };

export const SideMainLayoutMenu = [
    {
      text: 'Explore resources',
      type: 'section',
      defaultExpanded: true,
      items: [
        { type: 'link', text: 'Home', href: '/' },
        { type: 'link', text: 'RDS Instances', href: '/rds/instances/' },
        { type: 'link', text: 'ElastiCache Clusters', href: '/clusters/elasticache/' },
        { type: 'link', text: 'Memory Clusters', href: '/clusters/memorydb/' },
        { type: 'link', text: 'Aurora Clusters', href: '/clusters/aurora/' },
        { type: 'link', text: 'DocumentDB Clusters', href: '/clusters/documentdb/' },
        { type: 'link', text: 'Settings', href: '/settings' },
        { type: 'link', text: 'Logout', href: '/logout' }
      ],
    }
  ];


export const breadCrumbs = [{text: 'Service',href: '#',},{text: 'Resource search',href: '#',},];
  