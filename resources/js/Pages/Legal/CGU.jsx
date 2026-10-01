import LegalLayout from './LegalLayout';

export default function CGU() {
    return (
        <LegalLayout title="Conditions générales d’utilisation">
            <div className="prose prose-slate max-w-none dark:prose-invert">
                <p className="not-prose rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-100">
                    Modèle générique à compléter et à faire valider avant toute
                    publication. Remplacez notamment les coordonnées de
                    l’éditeur et les clauses locales applicables.
                </p>
                <h1>Conditions générales d’utilisation</h1>
                <p>
                    Dernière mise à jour : 30 septembre 2026. Les présentes
                    conditions décrivent, à titre de modèle, les règles
                    applicables à l’accès au service BotHosting.
                </p>

                <h2>1. Éditeur et objet du service</h2>
                <p>
                    BotHosting est un service permettant de préparer, déployer
                    et gérer des bots, notamment en Node.js et Python. Avant
                    publication, l’éditeur doit compléter sa dénomination, son
                    adresse et ses coordonnées de contact :{' '}
                    <strong>[coordonnées de l’éditeur à compléter]</strong>.
                </p>

                <h2>2. Création et sécurité du compte</h2>
                <p>
                    L’utilisateur fournit des informations exactes et maintient
                    la confidentialité de ses identifiants. Il est responsable
                    des activités réalisées depuis son compte et doit signaler
                    sans délai tout accès non autorisé à l’éditeur.
                </p>

                <h2>3. Règles d’utilisation</h2>
                <p>
                    L’utilisateur s’engage à respecter les lois applicables et
                    les droits de tiers. Il ne doit pas utiliser le service pour
                    distribuer des logiciels malveillants, mener des attaques,
                    contourner des mesures de sécurité, envoyer des
                    communications non sollicitées ou perturber le service ou
                    ses utilisateurs.
                </p>

                <h2>4. Pièces virtuelles, achats et facturation</h2>
                <p>
                    Les pièces sont des unités virtuelles utilisables dans le
                    service selon les fonctionnalités disponibles. Elles n’ont
                    pas de valeur monétaire, ne sont ni transférables ni
                    convertibles en espèces, sauf disposition légale impérative.
                    Le service peut proposer des pièces gratuites et des lots
                    payants. Le prix, le contenu et les conditions de chaque
                    achat sont indiqués avant le paiement.
                </p>
                <p>
                    Les paiements en ligne sont traités par le prestataire de
                    paiement indiqué lors de la commande. Les modalités de
                    rétractation, de remboursement et de facturation doivent
                    être précisées par l’éditeur conformément au droit
                    applicable, notamment pour les contenus ou services
                    numériques.
                </p>

                <h2>5. Disponibilité et suspension</h2>
                <p>
                    L’éditeur met en œuvre des efforts raisonnables pour assurer
                    le fonctionnement du service, sans garantir une disponibilité
                    ininterrompue. Un serveur peut être suspendu en cas de
                    ressources insuffisantes, de manquement aux présentes
                    conditions ou de nécessité technique ou légale.
                </p>

                <h2>6. Propriété intellectuelle et contenus</h2>
                <p>
                    Chaque partie conserve les droits qu’elle détient sur ses
                    éléments. L’utilisateur reste responsable des contenus,
                    programmes et données qu’il déploie et doit disposer des
                    droits nécessaires à leur utilisation.
                </p>

                <h2>7. Responsabilité</h2>
                <p>
                    Dans les limites permises par la loi, l’éditeur ne répond
                    pas des dommages résultant d’une utilisation non conforme,
                    d’une interruption imputable à un tiers ou d’un événement
                    extérieur à son contrôle. Cette clause ne limite pas les
                    droits qui ne peuvent être exclus par la loi.
                </p>

                <h2>8. Résiliation et modifications</h2>
                <p>
                    L’utilisateur peut cesser d’utiliser le service et demander
                    la suppression de son compte selon les moyens proposés dans
                    l’application. L’éditeur peut modifier les présentes
                    conditions et indiquera leur date de mise à jour. Les
                    conséquences sur les utilisateurs doivent être précisées
                    selon le droit applicable.
                </p>

                <h2>9. Droit applicable et contact</h2>
                <p>
                    Le droit applicable, la juridiction compétente et les
                    coordonnées de contact doivent être complétés par
                    l’éditeur :{' '}
                    <strong>[droit, juridiction et contact à compléter]</strong>.
                </p>
            </div>
        </LegalLayout>
    );
}
