import LegalLayout from './LegalLayout';

export default function RGPD() {
    return (
        <LegalLayout title="Politique de confidentialité">
            <div className="prose prose-slate max-w-none dark:prose-invert">
                <p className="not-prose rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-100">
                    Modèle indicatif à adapter aux traitements réellement
                    effectués et à faire valider avant publication. Complétez
                    l’identité du responsable, les durées de conservation et
                    les coordonnées de contact.
                </p>
                <h1>Politique de confidentialité</h1>
                <p>
                    Dernière mise à jour : 30 septembre 2026. Cette page décrit
                    les catégories de données susceptibles d’être traitées par
                    BotHosting dans le cadre de la gestion des comptes,
                    l’hébergement des bots et la facturation.
                </p>

                <h2>1. Responsable du traitement</h2>
                <p>
                    Le responsable du traitement est{' '}
                    <strong>[nom légal de l’éditeur à compléter]</strong>,
                    joignable à{' '}
                    <strong>[adresse postale et adresse e-mail à compléter]</strong>.
                    Cette identité et ces coordonnées doivent être renseignées
                    avant mise en production.
                </p>

                <h2>2. Données susceptibles d’être collectées</h2>
                <ul>
                    <li>
                        Données de compte : nom, adresse e-mail, identifiants
                        et informations de vérification.
                    </li>
                    <li>
                        Données de service : noms des bots, langage, ressources
                        demandées, identifiants techniques et statut.
                    </li>
                    <li>
                        Données d’utilisation et de sécurité : journaux
                        techniques nécessaires au diagnostic et à la protection
                        du service.
                    </li>
                    <li>
                        Données de transaction : identifiants de paiement,
                        montant et statut. Les données de carte sont traitées
                        par Stripe et ne doivent pas être stockées par
                        BotHosting.
                    </li>
                </ul>

                <h2>3. Finalités et bases juridiques</h2>
                <p>
                    Selon le déploiement réel, ces données peuvent être
                    utilisées pour fournir le service et gérer les comptes
                    (exécution du contrat), traiter les paiements (contrat et
                    obligations légales), protéger l’application et prévenir
                    les abus (intérêt légitime), et respecter les obligations
                    comptables ou réglementaires. L’éditeur doit confirmer les
                    bases applicables à chaque traitement.
                </p>

                <h2>4. Destinataires et prestataires</h2>
                <p>
                    L’accès est limité aux personnes autorisées et aux
                    prestataires nécessaires au fonctionnement du service. Les
                    intégrations prévues peuvent inclure Stripe pour le
                    paiement et Pterodactyl pour la gestion de serveurs. Leurs
                    rôles, lieux de traitement et garanties doivent être
                    vérifiés et documentés avant le lancement.
                </p>

                <h2>5. Durées de conservation</h2>
                <p>
                    Les données sont conservées uniquement pendant la durée
                    nécessaire aux finalités annoncées et aux obligations
                    légales. Inscrivez ici les durées réelles pour les comptes
                    supprimés, les données de facturation, les journaux et les
                    sauvegardes :{' '}
                    <strong>[durées de conservation à compléter]</strong>.
                </p>

                <h2>6. Cookies et stockage local</h2>
                <p>
                    L’application utilise des mécanismes techniques nécessaires
                    à la connexion et au fonctionnement de ses pages. La
                    préférence de thème et le choix affiché par la bannière
                    peuvent être mémorisés dans le stockage local du navigateur.
                    Décrivez ici tout outil d’analyse, publicité ou autre
                    traceur ajouté ultérieurement et recueillez le consentement
                    requis avant son activation.
                </p>

                <h2>7. Vos droits</h2>
                <p>
                    Sous réserve des conditions prévues par la réglementation,
                    vous pouvez demander l’accès, la rectification,
                    l’effacement, la limitation ou la portabilité de vos
                    données, vous opposer à certains traitements et retirer
                    votre consentement lorsqu’il constitue leur base. Adressez
                    votre demande à{' '}
                    <strong>[contact confidentialité à compléter]</strong>.
                    Vous pouvez également introduire une réclamation auprès de
                    l’autorité de contrôle compétente, notamment la CNIL en
                    France.
                </p>

                <h2>8. Sécurité et transferts</h2>
                <p>
                    Des mesures techniques et organisationnelles adaptées
                    doivent protéger les données contre les accès non
                    autorisés, les pertes et les altérations. Complétez les
                    informations relatives aux transferts hors Espace économique
                    européen et aux garanties applicables, le cas échéant :{' '}
                    <strong>[transferts et garanties à préciser]</strong>.
                </p>

                <h2>9. Mise à jour</h2>
                <p>
                    Cette politique peut être mise à jour pour refléter les
                    changements du service ou des obligations applicables. La
                    date de révision figure en tête de page.
                </p>
            </div>
        </LegalLayout>
    );
}
