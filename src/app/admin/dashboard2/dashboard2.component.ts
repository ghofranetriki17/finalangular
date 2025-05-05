import { Component, OnInit } from '@angular/core';
import { ChartDataset, ChartOptions } from 'chart.js';
import { ApiService } from 'src/app/core/services/api.service';

@Component({
  selector: 'app-dashboard2',
  templateUrl: './dashboard2.component.html',
  styleUrls: ['./dashboard2.component.scss']
})
export class Dashboard2Component implements OnInit {
  // Labels dynamiques
  labels: { [key: string]: string[] } = {};
  datasets: { [key: string]: ChartDataset[] } = {};

  chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Statistiques Dashboard' }
    }
  };

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadMembres();
    this.loadCollections();
    this.loadDefiles();
    this.loadFormations();
    this.loadDemandesStage();
    this.loadStagiaires();
  }

  loadMembres() {
    this.api.getMembres().subscribe(membres => {
      const counts: any = { admin: 0, designer: 0, stagiaire: 0, client: 0 };
      membres.forEach(m => counts[m.role]++);
      this.labels['membres'] = Object.keys(counts);
      this.datasets['membres'] = [{
        label: 'Membres par rôle',
        data: Object.values(counts),
        backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726', '#AB47BC']
      }];
    });
  }

  loadCollections() {
    this.api.getCollections().subscribe(collections => {
      const types: { [key: string]: number } = {};
      collections.forEach(c => types[c.type] = (types[c.type] || 0) + 1);
      this.labels['collections'] = Object.keys(types);
      this.datasets['collections'] = [{
        label: 'Collections par type',
        data: Object.values(types),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
      }];
    });
  }

  loadDefiles() {
    this.api.getDefiles().subscribe(defiles => {
      const lieux: { [key: string]: number } = {};
      defiles.forEach(d => lieux[d.lieu] = (lieux[d.lieu] || 0) + 1);
      this.labels['defiles'] = Object.keys(lieux);
      this.datasets['defiles'] = [{
        label: 'Défilés par lieu',
        data: Object.values(lieux),
        backgroundColor: '#4BC0C0'
      }];
    });
  }

  loadFormations() {
    this.api.getFormations().subscribe(formations => {
      const designers: { [id: number]: number } = {};
      formations.forEach(f => designers[f.designerId] = (designers[f.designerId] || 0) + 1);
      this.labels['formations'] = Object.keys(designers).map(id => `Designer ${id}`);
      this.datasets['formations'] = [{
        label: 'Formations par designer',
        data: Object.values(designers),
        backgroundColor: '#FF9F40'
      }];
    });
  }

  loadDemandesStage() {
    this.api.getDemandesStage().subscribe(demandes => {
      const stats: any = { en_attente: 0, accepte: 0, refuse: 0 };
      demandes.forEach(d => stats[d.statut]++);
      this.labels['demandes'] = Object.keys(stats);
      this.datasets['demandes'] = [{
        label: 'Demandes de stage',
        data: Object.values(stats),
        backgroundColor: ['#9CCC65', '#66BB6A', '#EF5350']
      }];
    });
  }

  loadStagiaires() {
    this.api.getStagiaires().subscribe(stagiaires => {
      const niveaux: { [key: string]: number } = {};
      stagiaires.forEach(s => niveaux[s.niveau] = (niveaux[s.niveau] || 0) + 1);
      this.labels['stagiaires'] = Object.keys(niveaux);
      this.datasets['stagiaires'] = [{
        label: 'Stagiaires par niveau',
        data: Object.values(niveaux),
        backgroundColor: '#BA68C8'
      }];
    });
  }
}
