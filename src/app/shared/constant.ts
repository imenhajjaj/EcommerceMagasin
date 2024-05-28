

export const breadcrumbsMenu=[
    {
        label:'Categories',
        path:'/categories',
        children:[
            {
                path:':category'
            },
            {
                path:'/product/:id'
            }
        ]
    }
];

export const MENU:{
    title:string;
    path:string;
}[]
=[
   
    {
        title:'Épicerie',
        path:'/categories/Men'
    },
    {
        title:'Boisson',
        path:'/categories/Women'
    },
    {
        title:'CHOCOLa',
        path:'/categories/Groceries'
    },
    {
        title:'',
        path:'/categories/Packaged Foods'
    }
]

