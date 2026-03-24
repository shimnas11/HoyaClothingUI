import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { CreateExhibition } from '../create-exhibition/create-exhibition';
import { CommonModule } from '@angular/common';
import { ListExhibition } from '../list-exhibition/list-exhibition';
import { ExhibitionService } from '../../../services/exhibition-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-exhibition-landing',
  imports: [CreateExhibition, CommonModule, ListExhibition],
  templateUrl: './exhibition-landing.html',
  styleUrl: './exhibition-landing.css',
})
export class ExhibitionLanding implements OnInit {
  // invoices: any[] = [];
  showModal = false;
  @ViewChild('listComp') listComponent: any;
  constructor() { }
  openModal() {
    this.showModal = true;
  }

  ngOnInit(): void { }



  closeModal(event: boolean) {

    this.showModal = false;
    if (event) {
      this.listComponent.loadExhibitions();
    }
  }

}
