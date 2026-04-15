import { Component } from '@angular/core';
@Component({ selector: 'app-home', templateUrl: './home.component.html', styleUrls: ['./home.component.css'] })
export class HomeComponent {
  steps = [
    { icon: 'fa-solid fa-user-plus', title: 'Inscrivez-vous', desc: 'Créez votre compte gratuitement en quelques secondes.' },
    { icon: 'fa-solid fa-camera', title: 'Publiez un article', desc: 'Photographiez et décrivez ce que vous souhaitez donner.' },
    { icon: 'fa-solid fa-handshake', title: 'Échangez', desc: 'Communiquez et organisez la remise avec le demandeur.' },
  ];
  services = [
    { icon: 'fa-regular fa-comment-dots', title: 'Messagerie intégrée', desc: 'Échangez directement avec les donateurs et demandeurs via notre chat sécurisé.' },
    { icon: 'fa-regular fa-heart', title: 'Liste de favoris', desc: 'Sauvegardez les articles qui vous intéressent pour les retrouver facilement.' },
    { icon: 'fa-solid fa-truck', title: 'Options de livraison', desc: 'Bpost, DHL ou retrait en main propre selon votre préférence.' },
    { icon: 'fa-solid fa-shield-halved', title: 'Plateforme sécurisée', desc: 'Vos données sont protégées et les échanges restent confidentiels.' },
    { icon: 'fa-solid fa-magnifying-glass', title: 'Recherche avancée', desc: 'Trouvez rapidement les articles qui vous correspondent par catégorie.' },
    { icon: 'fa-solid fa-leaf', title: 'Engagement écologique', desc: 'Chaque don compte pour réduire le gaspillage et protéger la planète.' },
  ];
}
