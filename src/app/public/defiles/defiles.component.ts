import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Defile } from '../../models/defile';

@Component({
  selector: 'app-defiles',
  templateUrl: './defiles.component.html',
  styleUrls: ['./defiles.component.scss']
})
export class DefilesComponent implements OnInit {
  defiles: Defile[] = [];
  loading = true;
  error = false;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDefiles();
  }

  loadDefiles(): void {
    this.apiService.getDefiles().subscribe({
      next: (defiles) => {
        this.defiles = defiles;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des défilés:', error);
        this.loading = false;
        this.error = true;
      }
    });
  }

  reserverPlace(defileId: number): void {
    this.router.navigate(['/reservation', defileId]);
  }
}