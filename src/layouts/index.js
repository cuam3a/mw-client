import React from 'react';
import LogLayout from './log.layout';
import UserLayout from './user.layout';
import AdminLayout from './admin.layout';

const LayoutLog = ({children}) => 
    <LogLayout>{children}</LogLayout>;

const LayoutUser = ({children}) => 
    <UserLayout>{children}</UserLayout>;

const LayoutAdmin = ({children}) => 
    <AdminLayout>{children}</AdminLayout>;

export { LayoutLog, LayoutUser, LayoutAdmin };