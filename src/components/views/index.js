import React from 'react';
//PUBLIC
import PublicMiwhatsView from './public/publicmiwhats.view'
import PublicIndexView from './public/publicindex.view'
import LoginView from './public/login.view'
import RegisterView from './public/register.view'
import RegisterSuccessView from './public/registersuccess.view'
import VerifyMailView from './public/verify.view'
import ChangePasswordView from './public/changepassword.view'
import ChangePasswordSuccessView from './public/changepasswordsuccess.view'
//USER
import DashboardView from './user/dashboard.view'
import MiwhatsView from './user/miwhats.view'
import MiwhatsAddView from './user/miwhatsadd.view'
import MiwhatsEditView from './user/miwhatsedit.view'
import PlansView from './user/plans.view'
import PlansPayloadView from './user/plansPayload.view'
import ProfileView from './user/profile.view'
import ReportsView from './user/reports.view'
import CancelView from './user/cancel.view'
//ADMIN
import DashboardAdminView from './admin/dashboard.view'
import PlansAdminView from './admin/plans.view'
import PlansAdminAddView from './admin/planadd.view'
import PlansAdminEditView from './admin/planedit.view'
import UsersAdminView from './admin/users.view'
import MiwhatsAdminView from './admin/miwhats.view'
import ReportPaymentAdminView from './admin/reportPayment.view'
import MiwhatsAdminEditView from './admin/miwhatsedit.view'
import UserAdminEditView from './admin/useredit.view'

//PULIC
const PublicMiwhats = () => <PublicMiwhatsView />;
const PublicIndex =() => <PublicIndexView />;
const Login = () => <LoginView />;
const Register = () => <RegisterView />;
const Registersuccess = () => <RegisterSuccessView />;
const Verifymail = () => <VerifyMailView />;
const Changepassword = () => <ChangePasswordView />;
const Changepasswordsuccess = () => <ChangePasswordSuccessView />;
//USER
const Dashboard = () => <DashboardView />;
const Miwhats = () => <MiwhatsView />;
const MiwhatsAdd = () => <MiwhatsAddView />;
const MiwhatsEdit = () => <MiwhatsEditView />;
const Plans = () => <PlansView />;
const PlansPayload = () => <PlansPayloadView />;
const Profile = () => <ProfileView />;
const Reports = () => <ReportsView />;
const Cancel = () => <CancelView />;
//ADMIN
const AdminDashboard = () => <DashboardAdminView />;
const AdminPlans = () => <PlansAdminView />;
const AdminPlansAdd = () => <PlansAdminAddView />;
const AdminPlansEdit = () => <PlansAdminEditView />;
const AdminUsers = () => <UsersAdminView />;
const AdminMiwhats = () => <MiwhatsAdminView />;
const AdminReportPayment = () => <ReportPaymentAdminView />;
const AdminMiwhatsEdit = () => <MiwhatsAdminEditView />;
const AdminUserEdit = () => <UserAdminEditView />;

export { 
    PublicMiwhats, PublicIndex, Login, Register, Registersuccess, Verifymail, Changepassword, Changepasswordsuccess, //PULIC
    Dashboard, Miwhats, MiwhatsAdd, MiwhatsEdit, Plans, Profile, PlansPayload, Reports, Cancel,//USER
    AdminDashboard, AdminPlans, AdminPlansAdd, AdminPlansEdit, AdminUsers, AdminMiwhats, AdminReportPayment, AdminMiwhatsEdit, AdminUserEdit //ADMIN
};