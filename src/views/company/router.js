import CompanyView from './CompanyView';
import CompanyReg from './CompanyReg';

export const companiesRouters = [
    {
        name: 'Companies',
        path: '/companies',
        component: CompanyView
    },
    {
        name: 'CompanyDetail',
        path: '/companyDetail',
        component: () => import('./CompanyDetail')
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