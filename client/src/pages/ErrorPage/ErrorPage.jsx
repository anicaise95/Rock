import React from 'react';
import { useRouteError } from 'react-router-dom';
import { isRouteErrorResponse } from 'react-router-dom';

export default function ErrorPage() {
    const error = useRouteError();

    if (isRouteErrorResponse(error)) {

        if (error.status === 404) {
            return <div>Cette page n'existe pas !</div>;
        }

        if (error.status === 401) {
            return <div>Vous n'êtes pas autorisé à voir cette page.</div>;
        }

        if (error.status === 503) {
            return <div>Le service ne fonctionne pas. Contactez-nous !</div>;
        }
    }

    return <div>{error.message || error.statusText}</div>;
}