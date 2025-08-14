export interface HeaderSubItem {
  subtheme: string;
}

export interface HeaderSubMenu {
  items: HeaderSubItem[];
  theme: string;
}

export type HeaderMenu = {
  'Части речи': string[];
  Тесты: string[];
  Диктанты: HeaderSubMenu[];
  Теория: string[];
  Тренажеры: Array<string | HeaderSubMenu>;
};

export type HeaderCategoryType = keyof HeaderMenu;

export type HeaderRoutes = {
  [key in HeaderCategoryType]: string;
};
