import './App.css';
import React, { useEffect, useContext } from 'react';
import { BrowserRouter, Route, Switch, useHistory, HashRouter } from 'react-router-dom';
import { 
  PublicMiwhats, PublicIndex, Login, Register, Registersuccess, Verifymail, Changepassword, Changepasswordsuccess, //PUBLIC
  Dashboard, Miwhats, MiwhatsAdd, MiwhatsEdit, Plans, Profile, PlansPayload, Reports, Cancel,//USER
  AdminDashboard, AdminPlans, AdminPlansAdd, AdminPlansEdit, AdminUsers, AdminMiwhats, AdminReportPayment, AdminMiwhatsEdit, AdminUserEdit //ADMIN
} from './components/views';
import { LayoutLog, LayoutUser, LayoutAdmin } from './layouts';
import { AppContext } from './application/provider';
import { NotificationsContext } from './application/provider/notifications.provider';
import LoginService from './application/services/login.service';
import NotificationsService from './application/services/user.notifications.service';
var LandingPage = './landingPage'

function App() {
  const [ state, setState ] = useContext(AppContext);
  const [ notifications, setNotifications ] = useContext(NotificationsContext);
  
  useEffect(() => {
      const check = async () => {
      const email = JSON.parse(localStorage.getItem('email'));
      let res = await LoginService.checkToken(email);
      let miWhats = null;
      console.log(res)
      if(res.user && res.user.miWhats.length > 0){
        miWhats = res.user.miWhats[0]
      }
      if(res.success){
        setState({...state, user: res.user, isLogin: true,  miWhats: miWhats })
      }
    }
    check();
  }, []);

  useEffect(() => {
    const check = async () => {
      let res = await NotificationsService.getNotificaciones();
      if(res.success){
        setNotifications({...notifications, notifications: res.notifications })
      }
    }
    check();
  }, []);

  return (
    <BrowserRouter>
      <Switch>
        {/* PUBLIC */}
        {/* <RouteWrapperPublic exact path="/" component={PublicMiwhats} layout={<></>}/> */}
        <RouteWrapperPrivate exact path="/entrar" component={Login} layout={LayoutLog}/>
        <RouteWrapperPublic exact path="/registro" component={Register} layout={LayoutLog} />
        <RouteWrapperPublic exact path="/registro-completo" component={Registersuccess} layout={LayoutLog} />
        <RouteWrapperPublic exact path="/verificar/:email/:idmail" component={Verifymail} layout={LayoutLog} />
        <RouteWrapperPublic exact path="/cambiar-constrasena" component={Changepassword} layout={LayoutLog} />
        <RouteWrapperPublic exact path="/verificar-constrasena/:email/:idmail" component={Changepasswordsuccess} layout={LayoutLog} />
        {/* USER */}
        <RouteWrapperPrivate exact path="/usuario/dashboard" component={Dashboard} layout={LayoutUser}/>
        <RouteWrapperPrivate exact path="/usuario/planes" component={Plans} layout={LayoutUser}/>
        <RouteWrapperPrivate exact path="/usuario/reportes" component={Reports} layout={LayoutUser}/>
        <RouteWrapperPrivate exact path="/usuario/planes/comprar/:id" component={PlansPayload} layout={LayoutUser}/>
        <RouteWrapperPrivate exact path="/usuario/perfil" component={Profile} layout={LayoutUser}/>
        <RouteWrapperPrivate exact path="/usuario/cancelar" component={Cancel} layout={LayoutUser}/>
        <RouteWrapperPrivate exact path="/usuario/miwhats/" component={Miwhats} layout={LayoutUser}/>
        <RouteWrapperPrivate exact path="/usuario/miwhats/agregar" component={MiwhatsAdd} layout={LayoutUser}/>
        <RouteWrapperPrivate exact path="/usuario/miwhats/editar/:id" component={MiwhatsEdit} layout={LayoutUser}/>
        {/* ADMIN */}
        <RouteWrapperPrivateAdmin exact path="/admin/dashboard" component={AdminDashboard} layout={LayoutAdmin}/>
        <RouteWrapperPrivateAdmin exact path="/admin/planes" component={AdminPlans} layout={LayoutAdmin}/>
        <RouteWrapperPrivateAdmin exact path="/admin/planes/agregar" component={AdminPlansAdd} layout={LayoutAdmin}/>
        <RouteWrapperPrivateAdmin exact path="/admin/planes/editar/:id" component={AdminPlansEdit} layout={LayoutAdmin}/>
        <RouteWrapperPrivateAdmin exact path="/admin/usuarios" component={AdminUsers} layout={LayoutAdmin}/>
        <RouteWrapperPrivateAdmin exact path="/admin/usuarios/editar/:id" component={AdminUserEdit} layout={LayoutAdmin}/>
        <RouteWrapperPrivateAdmin exact path="/admin/miwhats" component={AdminMiwhats} layout={LayoutAdmin}/>
        <RouteWrapperPrivateAdmin exact path="/admin/miwhats/editar/:id" component={AdminMiwhatsEdit} layout={LayoutAdmin}/>
        <RouteWrapperPrivateAdmin exact path="/admin/reportes/pagos" component={AdminReportPayment} layout={LayoutAdmin}/>
        {/* PUBLIC MIWHATS */}
        <Route exact path="/" render={() => <PublicIndex />} />
        <Route exact path="/:link" render={() => <PublicMiwhats />} />
        {/* <Route render={() => <Redirect to="/entrar" />} /> */}
      </Switch>
    </BrowserRouter>
  );
}

function RouteWrapperPrivate({
  component: Component, 
  layout: Layout,
  ...rest
}) {
  let history = useHistory();
  const [ state, setState ] = useContext(AppContext);
  useEffect(() => {
      const check = async () => {
      const email = JSON.parse(localStorage.getItem('email'));
      let res = await LoginService.checkToken(email);
      if(res.success){
        if(res.user.idUserType === 2){
          let miWhats = null;
          if(res.user.miWhats.length > 0){
            miWhats = res.user.miWhats[0]
          }
          setState({...state, user: res.user, isLogin: true,  miWhats: miWhats })
        }
        else{
          history.push("/entrar");
        }
      }else{
        history.push("/entrar");
      }
    }
    check();
  }, []);

  return (
    <Route {...rest} render={(props) =>
        <Layout {...props} >
          <Component {...props} />
        </Layout>
        } >
    </Route>
    
  );
}

function RouteWrapperPrivateAdmin({
  component: Component, 
  layout: Layout,
  ...rest
}) {
  let history = useHistory();
  const [ state, setState ] = useContext(AppContext);
  useEffect(() => {
      const check = async () => {
      const email = JSON.parse(localStorage.getItem('email'));
      let res = await LoginService.checkToken(email);
      if(res.success){
        if(res.user.idUserType === 1){
          setState({...state, user: res.user, isLogin: true })
        }
        else{
          history.push("/entrar");
        }
      }else{
        history.push("/entrar");
      }
    }
    check();
  }, []);

  return (
    <Route {...rest} render={(props) =>
        <Layout {...props} >
          <Component {...props} />
        </Layout>
        } >
    </Route>
    
  );
}

function RouteWrapperPublic({
  component: Component, 
  layout: Layout,
  ...rest
}) {
  return (
    <Route exact {...rest} render={(props) =>
      <Layout {...props}>
        <Component {...props} />
      </Layout>
    } />
  );
}

export default App;
