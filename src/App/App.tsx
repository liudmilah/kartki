import React, { Suspense } from 'react';
import { I18nextProvider } from 'react-i18next';
import { ApolloProvider } from '@apollo/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { i18n, Loading, Layout, NotFound } from 'Common';
import { Library, CreateStudySet, EditStudySet, StudySet, Flashcards } from 'StudySet';
import routes from 'routes';
import GqlClient from 'gql-client';
import { Privacy, useAuth, AuthProvider, SignupRequest, Login, SocialAuth, SignupConfirm, ResetPassword } from 'Auth';

function Content() {
    const { loggedIn, loading } = useAuth();

    if (loading) {
        return <Loading />;
    }

    if (loggedIn) {
        return (
            <Routes>
                <Route path={routes.SETS} element={<Library />} />
                <Route path={routes.CREATE} element={<CreateStudySet />} />
                <Route path={routes.EDIT} element={<EditStudySet />} />
                <Route path={routes.FLASHCARDS} element={<Flashcards />} />
                <Route path={routes.SET} element={<StudySet />} />
                <Route path={routes.PRIVACY} element={<Privacy />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        );
    }

    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path={routes.SIGNUP_REQUEST} element={<SignupRequest />} />
            <Route path={routes.SIGNUP_CONFIRM} element={<SignupConfirm />} />
            <Route path={routes.PASSWORD_RESET} element={<ResetPassword />} />
            <Route path={routes.PRIVACY} element={<Privacy />} />
            <Route path={routes.AUTH} element={<SocialAuth />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
}

function App() {
    return (
        <I18nextProvider i18n={i18n}>
            <ApolloProvider client={GqlClient}>
                <AuthProvider>
                    <BrowserRouter>
                        <Suspense fallback={<Loading />}>
                            <Layout>
                                <Content />
                            </Layout>
                        </Suspense>
                    </BrowserRouter>
                </AuthProvider>
            </ApolloProvider>
        </I18nextProvider>
    );
}

export default App;
