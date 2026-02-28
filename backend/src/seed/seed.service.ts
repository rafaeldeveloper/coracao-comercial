import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { CategoriesService } from '../categories/categories.service';
import { BusinessesService } from '../businesses/businesses.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Business } from '../businesses/business.entity';

const CATEGORIES = [
  { id: 'alimentacao', name: 'Alimentação',    emoji: '🍽️',  color: '#EF4444', bg: '#FEE2E2', description: 'Restaurantes, lanchonetes, delivery' },
  { id: 'beleza',      name: 'Beleza',         emoji: '💄',  color: '#EC4899', bg: '#FCE7F3', description: 'Salões, barbearias, estética' },
  { id: 'saude',       name: 'Saúde',          emoji: '🏥',  color: '#3B82F6', bg: '#DBEAFE', description: 'Clínicas, farmácias, terapias' },
  { id: 'reparos',     name: 'Reparos',        emoji: '🔧',  color: '#F97316', bg: '#FFEDD5', description: 'Elétrica, hidráulica, pintura' },
  { id: 'educacao',    name: 'Educação',        emoji: '📚',  color: '#8B5CF6', bg: '#EDE9FE', description: 'Cursos, tutoria, idiomas' },
  { id: 'tecnologia',  name: 'Tecnologia',     emoji: '💻',  color: '#06B6D4', bg: '#CFFAFE', description: 'TI, assistência técnica' },
  { id: 'moda',        name: 'Moda',           emoji: '👗',  color: '#A855F7', bg: '#F3E8FF', description: 'Roupas, calçados, acessórios' },
  { id: 'pets',        name: 'Pets',           emoji: '🐾',  color: '#F59E0B', bg: '#FEF3C7', description: 'Veterinários, pet shops' },
  { id: 'esportes',    name: 'Esportes',       emoji: '⚽',  color: '#22C55E', bg: '#DCFCE7', description: 'Academias, aulas, esportes' },
  { id: 'casa',        name: 'Casa & Deco',    emoji: '🏠',  color: '#EA580C', bg: '#FFEDD5', description: 'Móveis, decoração, jardim' },
  { id: 'eventos',     name: 'Eventos',        emoji: '🎉',  color: '#E11D48', bg: '#FFE4E6', description: 'Festas, buffet, fotografia' },
  { id: 'juridico',    name: 'Jurídico',       emoji: '⚖️',  color: '#475569', bg: '#F1F5F9', description: 'Advogados, consultorias' },
  { id: 'transporte',  name: 'Transporte',     emoji: '🚗',  color: '#0EA5E9', bg: '#E0F2FE', description: 'Mecânicas, frete, mototáxi' },
  { id: 'financeiro',  name: 'Financeiro',     emoji: '💰',  color: '#15803D', bg: '#DCFCE7', description: 'Crédito, câmbio, seguros' },
  { id: 'religioso',   name: 'Religioso',      emoji: '🙏',  color: '#B45309', bg: '#FEF3C7', description: 'Artigos, igrejas, serviços' },
  { id: 'arte',        name: 'Arte & Cultura', emoji: '🎨',  color: '#DB2777', bg: '#FCE7F3', description: 'Galerias, ateliês, shows' },
];

const BUSINESSES = [
  { id: 1,  name: 'Churrascaria do Zé',      categoryId: 'alimentacao', description: 'O melhor churrasco da cidade, com cortes nobres e buffet completo todo domingo.', address: 'Rua das Palmeiras, 142 - Centro',      phone: '(11) 9 9876-5432', rating: 4.9, reviewCount: 312, price: '$$',  tags: ['Churrasco','Buffet','Família'],             hours: 'Ter–Dom 11h–23h',                          featured: true,  rankPosition: 1  },
  { id: 2,  name: 'Studio Bella Hair',        categoryId: 'beleza',      description: 'Especialistas em coloração, cortes modernos e tratamentos capilares premium.',      address: 'Av. Brasil, 890 - Jardim América',      phone: '(11) 9 9123-4567', rating: 4.8, reviewCount: 245, price: '$$',  tags: ['Coloração','Corte','Escova'],               hours: 'Seg–Sáb 9h–20h',                           featured: true,  rankPosition: 2  },
  { id: 3,  name: 'TechFix Assistência',      categoryId: 'tecnologia',  description: 'Conserto de celulares, notebooks e tablets com garantia de 90 dias.',               address: 'Shopping Central, Loja 45',              phone: '(11) 9 9555-0011', rating: 4.7, reviewCount: 189, price: '$',   tags: ['Celular','Notebook','Tablet'],              hours: 'Seg–Sáb 9h–18h',                           featured: false, rankPosition: 3  },
  { id: 4,  name: 'Clínica Vida Plena',       categoryId: 'saude',       description: 'Atendimento multidisciplinar: clínico geral, nutrição, fisioterapia e psicologia.',  address: 'Rua Saúde, 230 - Vila Nova',             phone: '(11) 9 9444-7788', rating: 4.8, reviewCount: 427, price: '$$',  tags: ['Clínica','Nutrição','Fisio'],               hours: 'Seg–Sex 7h–19h, Sáb 8h–14h',               featured: true,  rankPosition: 4  },
  { id: 5,  name: 'Elétrica do Mestre Paulo', categoryId: 'reparos',     description: 'Serviços elétricos residenciais e comerciais, instalações e reparos.',               address: 'Atende em toda a cidade',                phone: '(11) 9 9321-0099', rating: 4.6, reviewCount: 93,  price: '$',   tags: ['Elétrica','Instalação','Residencial'],      hours: 'Seg–Sáb 7h–18h',                           featured: false, rankPosition: 5  },
  { id: 6,  name: 'Academia PowerFit',        categoryId: 'esportes',    description: 'Musculação, funcional, crossfit e aulas coletivas. Avaliação física gratuita.',      address: 'Av. Esporte, 55 - Bairro Alto',          phone: '(11) 9 9876-3311', rating: 4.5, reviewCount: 158, price: '$$',  tags: ['Musculação','Crossfit','Funcional'],        hours: 'Seg–Sex 5h30–23h, Sáb 7h–17h',             featured: false, rankPosition: 6  },
  { id: 7,  name: 'Boutique Mila Moda',       categoryId: 'moda',        description: 'Roupas femininas e masculinas com as últimas tendências e preço justo.',             address: 'Rua Comércio, 310 - Centro',             phone: '(11) 9 9212-8844', rating: 4.7, reviewCount: 211, price: '$$',  tags: ['Roupas','Feminino','Masculino'],            hours: 'Seg–Sáb 10h–20h, Dom 11h–18h',             featured: true,  rankPosition: 7  },
  { id: 8,  name: 'PetCare Veterinária',      categoryId: 'pets',        description: 'Consultas, vacinas, banho e tosa, cirurgias e emergências 24h.',                    address: 'Rua dos Pets, 77 - Jardim Verde',        phone: '(11) 9 9654-2211', rating: 4.9, reviewCount: 376, price: '$$',  tags: ['Veterinário','Banho','Vacinas'],            hours: '24 horas',                                 featured: true,  rankPosition: 8  },
  { id: 9,  name: 'Idiomas Global',           categoryId: 'educacao',    description: 'Inglês, espanhol, francês e mandarim. Turmas presenciais e online.',                address: 'Av. Aprendizado, 1500 - Centro',         phone: '(11) 9 9001-2233', rating: 4.6, reviewCount: 134, price: '$$',  tags: ['Inglês','Espanhol','Online'],               hours: 'Seg–Sex 7h–21h, Sáb 8h–16h',               featured: false, rankPosition: 9  },
  { id: 10, name: 'Buffet Festa & Alegria',   categoryId: 'eventos',     description: 'Decoração, buffet completo e espaço para festas infantis e eventos corporativos.',  address: 'Rua Festas, 200 - Bairro Novo',          phone: '(11) 9 9777-5566', rating: 4.8, reviewCount: 289, price: '$$$', tags: ['Buffet','Infantil','Corporativo'],           hours: 'Seg–Sex 9h–18h (eventos: finais de semana)', featured: true,  rankPosition: 10 },
  { id: 11, name: 'Advocacia Silva & Souza',  categoryId: 'juridico',    description: 'Direito trabalhista, família, cível e empresarial. Primeira consulta gratuita.',    address: 'Ed. Comercial Alfa, Sala 302',           phone: '(11) 9 9888-7766', rating: 4.5, reviewCount: 67,  price: '$$$', tags: ['Trabalhista','Família','Empresarial'],       hours: 'Seg–Sex 9h–18h',                           featured: false, rankPosition: 11 },
  { id: 12, name: 'Decorarte Interiores',     categoryId: 'casa',        description: 'Projetos de interiores, reforma e decoração para residências e comércios.',         address: 'Rua Design, 88 - Jardim Belo',           phone: '(11) 9 9345-6677', rating: 4.7, reviewCount: 103, price: '$$$', tags: ['Decoração','Projetos','Reforma'],            hours: 'Seg–Sex 9h–18h',                           featured: false, rankPosition: 12 },
  { id: 13, name: 'Padaria Pão Quente',       categoryId: 'alimentacao', description: 'Pães artesanais, bolos, salgados e café fresquinho desde as 5h da manhã.',         address: 'Rua da Farinha, 33 - Vila Boa',          phone: '(11) 9 9222-3344', rating: 4.9, reviewCount: 521, price: '$',   tags: ['Padaria','Artesanal','Café'],               hours: 'Todo dia 5h–21h',                           featured: true,  rankPosition: 13 },
  { id: 14, name: 'Barbearia Corte Fino',     categoryId: 'beleza',      description: 'Cortes masculinos modernos, barba e tratamentos. Ambiente premium.',                address: 'Rua do Estilo, 15 - Centro',             phone: '(11) 9 9111-2233', rating: 4.8, reviewCount: 177, price: '$$',  tags: ['Barba','Corte Masculino','Premium'],        hours: 'Ter–Sáb 9h–20h, Dom 9h–14h',               featured: false, rankPosition: 14 },
  { id: 15, name: 'Mecânica AutoTOP',         categoryId: 'transporte',  description: 'Revisões, freios, suspensão e elétrica automotiva. Orçamento sem compromisso.',     address: 'Av. Mecânica, 500 - Industrial',         phone: '(11) 9 9667-8899', rating: 4.6, reviewCount: 144, price: '$$',  tags: ['Mecânica','Revisão','Elétrica'],            hours: 'Seg–Sex 8h–18h, Sáb 8h–13h',               featured: false, rankPosition: 15 },
  { id: 16, name: 'Galeria Arte Viva',        categoryId: 'arte',        description: 'Exposições permanentes e temporárias, cursos de pintura, escultura e fotografia.',  address: 'Rua das Artes, 110 - Centro Cultural',   phone: '(11) 9 9034-5566', rating: 4.7, reviewCount: 88,  price: '$',   tags: ['Arte','Exposições','Cursos'],               hours: 'Ter–Dom 10h–19h',                           featured: false, rankPosition: 16 },
];

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private categoriesService: CategoriesService,
    @InjectRepository(Business)
    private businessRepo: Repository<Business>,
  ) {}

  async onModuleInit() {
    await this.seedCategories();
  }

  private async seedCategories() {
    for (const cat of CATEGORIES) {
      const existing = await this.categoriesService.findOne(cat.id);
      if (!existing) {
        await this.categoriesService.upsert(cat);
      }
    }
    this.logger.log(`Categories seeded (${CATEGORIES.length})`);
  }

  private async seedBusinesses() {
    for (const b of BUSINESSES) {
      const existing = await this.businessRepo.findOne({ where: { id: b.id } });
      if (!existing) {
        const entity = this.businessRepo.create({
          ...b,
          tags: JSON.stringify(b.tags),
        });
        await this.businessRepo.save(entity);
      }
    }
    this.logger.log(`Businesses seeded (${BUSINESSES.length})`);
  }
}
