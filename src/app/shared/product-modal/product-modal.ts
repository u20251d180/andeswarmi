import { Component, Input, Output, EventEmitter, HostListener, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { NgIf, NgFor } from '@angular/common';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  standalone: true,
  selector: 'app-product-modal',
  imports: [NgIf, NgFor, NgbCarouselModule],
  templateUrl: './product-modal.html',
  styleUrls: ['./product-modal.css']
})
export class ProductModalComponent implements OnChanges {
  @Input() product: any;
  @Input() blockClose = false;
  @Output() close = new EventEmitter<void>(); // ✅ así

  // Carrusel
  currentIndex = 0;
  images: string[] = [];
  imagesLoaded: { [key: number]: boolean } = {};

  ngOnChanges(changes: SimpleChanges) {
    if (changes['product']) {
      this.setupImages();
      this.currentIndex = 0;
    }
  }

  constructor(private cdr: ChangeDetectorRef) {}

  setupImages() {
    if (!this.product) {
      this.images = [];
      return;
    }

    // Soporta product.images (array) o product.image (string)
    if (Array.isArray(this.product.images) && this.product.images.length) {
      this.images = this.product.images;
    } else if (this.product.image) {
      this.images = [this.product.image];
    } else {
      this.images = [];
    }
    // Forzar actualización para que ngb-carousel renderice inmediatamente
    try { this.cdr.detectChanges(); } catch (e) { /* ignore during server-side or early */ }
  }

  onImageLoad(index: number) {
    this.imagesLoaded[index] = true;
    // debug log
    console.log('[ProductModal] image loaded index=', index, 'src=', this.images[index]);
    try { this.cdr.detectChanges(); } catch (e) {}
  }

  prev() {
    if (!this.images.length) return;
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  next() {
    if (!this.images.length) return;
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  goTo(index: number) {
    if (index >=0 && index < this.images.length) this.currentIndex = index;
  }

  closeModal() {
    this.close.emit(); // ✅ emite el evento para el padre
  }

  onOverlayClick() {
    if (!this.blockClose) this.closeModal();
  }

  // Teclas: left/right para navegar, Esc para cerrar
  @HostListener('window:keydown', ['$event'])
  handleKey(event: KeyboardEvent) {
    if (!this.product) return; // solo activo cuando el modal está abierto
    if (event.key === 'ArrowLeft') {
      this.prev();
    } else if (event.key === 'ArrowRight') {
      this.next();
    } else if (event.key === 'Escape') {
      this.closeModal();
    }
  }
}
