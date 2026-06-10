import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { PrimeNgButtonModule } from '../../shared/modules/primeng-button.module';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, PrimeNgButtonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
    
})
export class HomeComponent implements OnInit {

  currentStep = 0;

  stepsGroup1 = [
    {
      icon: '🖥️',
      color: 'ci-blue',
      titulo: 'PC de escritorio',
      descripcion: 'Mayor potencia por el precio. Ideal si tienes un espacio fijo y necesitas alto rendimiento para edición, gaming o diseño.'
    },
    {
      icon: '💻',
      color: 'ci-purple',
      titulo: 'Laptop',
      descripcion: 'Portabilidad sin sacrificar rendimiento. Perfecta para trabajo remoto, estudio o uso en múltiples espacios.'
    },
    {
      icon: '📋',
      color: 'ci-amber',
      titulo: '¿Cuál es tu uso principal?',
      descripcion: 'Ofimática, diseño, gaming o programación. Cada uso tiene requerimientos distintos de RAM, CPU y gráficos.'
    }
  ];

  stepsGroup2 = [
    {
      icon: '🧠',
      color: 'ci-green',
      titulo: 'RAM: ¿cuánta necesitas?',
      descripcion: '8 GB para uso básico, 16 GB para multitarea y diseño, 32 GB o más para edición de video y virtualización.'
    },
    {
      icon: '⚙️',
      color: 'ci-coral',
      titulo: 'Procesador: Intel vs AMD',
      descripcion: 'Intel destaca en rendimiento por núcleo; AMD ofrece más núcleos por precio. Ambos son excelentes según el uso.'
    },
    {
      icon: '💾',
      color: 'ci-teal',
      titulo: 'Almacenamiento SSD vs HDD',
      descripcion: 'SSD: arranque rápido y mejor respuesta. HDD: más capacidad por menor costo. Combínalos para el mejor resultado.'
    }
  ];

  stepsGroup3 = [
    {
      icon: '🛡️',
      color: 'ci-amber',
      titulo: 'Garantía y soporte',
      descripcion: 'Todos nuestros equipos incluyen garantía del fabricante. Te orientamos sobre coberturas y tiempos de respuesta.'
    },
    {
      icon: '💰',
      color: 'ci-purple',
      titulo: 'Define tu presupuesto',
      descripcion: 'Tenemos opciones desde equipos básicos hasta workstations profesionales. Tu presupuesto es el primer filtro.'
    },
    {
      icon: '👥',
      color: 'ci-blue',
      titulo: 'Asesoría personalizada',
      descripcion: 'Si tienes dudas específicas, nuestro equipo puede orientarte de forma directa antes de tomar cualquier decisión.'
    }
  ];

  faqs = [
    {
      pregunta: '¿Qué es esta plataforma?',
      respuesta: 'Es una tienda virtual que permite explorar productos, recibir recomendaciones personalizadas y realizar compras de manera rápida y segura.'
    },
    {
      pregunta: '¿Cuál es la diferencia entre una PC y una laptop?',
      respuesta: 'Las PCs de escritorio ofrecen mayor potencia por el precio, son más fáciles de actualizar y permiten mejores periféricos. Las laptops priorizan la portabilidad y el ahorro de espacio, ideales para quienes trabajan en varios lugares o se desplazan con frecuencia.'
    },
    {
      pregunta: '¿Cómo funciona el recomendador de productos?',
      respuesta: 'El sistema utiliza un proceso de 4 pasos: 1. Seleccionas una categoría de interés. 2. Indicas el tipo de uso. 3. El sistema muestra rango de precios recomendados. 4. El sistema muestra productos recomendados según tus respuestas.'
    },
    {
      pregunta: '¿Dónde puedo ver mis compras realizadas?',
      respuesta: 'En la sección “Mis Compras” o “Historial de Compras” de tu cuenta.'
    },
    {
      pregunta: '¿Cómo están organizados los productos?',
      respuesta: 'Los productos se encuentran organizados por categorías y tipos, lo que permite a los usuarios encontrar más fácilmente los artículos que buscan. Por ejemplo, una categoría puede ser "Laptop” y dentro de ella existir tipos como “Gaming”, “Edicion” o “Oficina”.'
    },
    {
      pregunta: '¿Puedo actualizar el hardware después de comprar?',
      respuesta: 'Depende del modelo. Las PCs de escritorio son muy actualizables: RAM, almacenamiento, GPU y más. Las laptops suelen permitir ampliar la RAM y el SSD, aunque varía por fabricante y modelo. Consúltanos antes de comprar y te orientamos.'
    }
  ];

  openFaqIndex: number | null = null;

  constructor(private router: Router, private productService: ProductService) {}

  ngOnInit(): void {}

  irAlRecomendador(): void {
    this.router.navigate(['/recomendador']);
  }

  prevStep(): void {
    if (this.currentStep > 0) this.currentStep--;
  }

  nextStep(): void {
    if (this.currentStep < 2) this.currentStep++;
  }

  goToStep(index: number): void {
    this.currentStep = index;
  }

  toggleFaq(index: number): void {
    this.openFaqIndex = this.openFaqIndex === index ? null : index;
  }
}