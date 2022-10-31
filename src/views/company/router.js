import CompanyView from './CompanyView';
import CompanyShow from './CompanyShow';
import CompanyReg from './CompanyReg';

export const companiesRouters = [
    {
        name: 'Companies',
        path: '/companies',
        component: CompanyView
    },
    {
        name: 'CompanyDetails',
        path: '/company-details',
        component: CompanyShow
    },
    {
        name: 'CompanyReg',
        path: '/company',
        component: CompanyReg
    },
    {
        name: 'CompanyEdit',
        path: '/companyEdit',
        component: () => import('./CompanyEdit')
    }
]

export const companiesRouter = companiesRouters.filter( (x) => {
    return x != null;
})