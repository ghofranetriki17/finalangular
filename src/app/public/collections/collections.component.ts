import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../core/services/api.service';
import { Collection } from '../../models/collection';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss']
})
export class CollectionsComponent implements OnInit {
  collections: Collection[] = [];
  loading = true;
  error = false;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadCollections();
  }

  loadCollections(): void {
    this.apiService.getCollections().subscribe({
      next: (collections) => {
        this.collections = collections;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur lors du chargement des collections:', error);
        this.loading = false;
        this.error = true;
      }
    });
  }
}
