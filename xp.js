
// action: string - Действие такие как: Убийство, Добыча, Торговля, Использование
// experience: {
//     min: number - Минимальный опыт
//     max: number - Максимальный опыт
//     fixed: number - Фиксированный опыт (Если не заданы: min и max)
//     first: number - Опыт за первый раз (Если не заданы: min и max, а потом будет использоваться fixed)
// }
// mob: string - Имя моба
let newAction = (action, mob, experience) => {
    let act = {
        action: action,
        experience: experience,
        mob: mob
    }
    return act;
}

let xp = [
    newAction('Убийство', 'Мирные взрослые животные', {
        min: 1,
        max: 3,
    }),
    newAction('Убийство', 'Разоритель', {
        fixed: 20,
    }),
    newAction('Убийство', 'Враждебные мобы', {
        fixed: 5,
    }),
    newAction('Убийство', 'Большой слизень и Лавовый куб', {
        fixed: 4,
    }),
    newAction('Убийство', 'Средний слизень и Лавовый куб', {
        fixed: 2,
    }),
    newAction('Убийство', 'Малый слизень и Лавовый куб', {
        fixed: 1,
    }),
    newAction('Убийство', 'Ифрит, Страж, Древний страж', {
        fixed: 10,
    }),
    newAction('Убийство', 'Ведьма, Разбойник, Иллюзор', {
        fixed: 5,
    }),
    newAction('Убийство', 'Дракон Края', {
        fixed: 500,
        first: 12000,
    }),
    newAction('Убийство', 'Иссушитель', {
        fixed: 50,
    }),

    newAction('Добыча', 'Угольная руда', {
        min: 1,
        max: 2,
    }),
    newAction('Добыча', 'Алмазная и изумрудная руда', {
        min: 3,
        max: 7,
    }),
    newAction('Добыча', 'Лазуритовая руда, Кварцевая руда Нижнего мира', {
        min: 2,
        max: 5,
    }),
    newAction('Добыча', 'Редстоуновая руда', {
        min: 1,
        max: 5,
    }),
    newAction('Добыча', 'Спаунер мобов', {
        min: 15,
        max: 43,
    }),

    newAction('Переплавка', 'Древние обломки', {
        fixed: 2,
    }),
    newAction('Переплавка', 'Алмазная руда, Изумрудная руда, Золотая руда, Кактус', {
        fixed: 1,
    }),
    newAction('Переплавка', 'Железная руда, Красная руда', {
        fixed: 0.7,
    }),
    newAction('Переплавка', 'Еда', {
        fixed: 0.35,
    }),
    newAction('Переплавка', 'Глина', {
        fixed: 0.3,
    }),
    newAction('Переплавка', 'Лазуритовая руда', {
        fixed: 0.2,
    }),
    newAction('Переплавка', 'Древесина', {
        fixed: 0.15,
    }),
    newAction('Переплавка', 'Остальное', {
        fixed: 0.1,
    }),

    newAction('Разное', 'Зелье опыта', {
        min: 3,
        max: 11,
    }),
    newAction('Разное', 'Торговля с жителями', {
        min: 3,
        max: 11,
    }),
    newAction('Разное', 'Разведение животных', {
        min: 1,
        max: 4,
    }),
    newAction('Разное', 'Ловля рыбы', {
        min: 1,
        max: 3,
    }),
]

let getXp = (lvl) => {
    if (lvl >= 1 && lvl <= 16) {
        return lvl * lvl + 6 * lvl;
    }
    if (lvl >= 17 && lvl <= 31) {
        return 2.5 * lvl * lvl - 40.5 * lvl + 360;
    }
    if (lvl >= 32) {
        return 4.5 * lvl * lvl - 162.5 * lvl + 2220;
    }
}

let calculate = (table, current_lvl, target_lvl) => {
    {
        table.innerHTML = '';
        let header = table.insertRow();
        let action = header.insertCell();
        action.innerHTML = 'Действие';
        let mob = header.insertCell();
        mob.innerHTML = 'Моб';
        let xp = header.insertCell();
        xp.innerHTML = 'Опыт';
        let need = header.insertCell();
        need.innerHTML = 'Сколько нужно раз';
    }
    let tbl = [];
    xp.forEach(act => {
        let row = table.insertRow();
        let action = row.insertCell();
        action.innerHTML = act.action;
        let mob = row.insertCell();
        mob.innerHTML = act.mob;
        let xp = row.insertCell();
        // Если не указан min или max, то используем fixed, а если наоборот, то min-max
        if (act.experience.min == undefined && act.experience.max == undefined) {
            // Если есть first
            if (act.experience.first != undefined) {
                xp.innerHTML = act.experience.first + '+' + act.experience.fixed;
            } else {
                xp.innerHTML = act.experience.fixed;
            }
        } else {
            xp.innerHTML = act.experience.min + '-' + act.experience.max;
        }
        let needt = row.insertCell();
        // Просчёт опыта
        let need_min_times = 0;
        let need_max_times = 0;
        {
            let current_xp = getXp(current_lvl);
            let target_xp = getXp(target_lvl);
            let xp_diff = target_xp - current_xp;
            // Рассмотрим случай если есть только fixed
            if (act.experience.min == undefined && act.experience.max == undefined && act.experience.first == undefined) {
                need_min_times = Math.ceil(xp_diff / act.experience.fixed);
                need_max_times = need_min_times
            } else if (act.experience.min == undefined && act.experience.max == undefined) { // Рассмотрим если есть first
                if (xp_diff > 0) {
                    need_min_times = 1;
                }
                let first_xp = xp_diff - act.experience.first;
                if (first_xp > 0) {
                    need_min_times = Math.ceil(first_xp / act.experience.fixed) + 1;
                }
                need_max_times = need_min_times;
            } else {
                need_min_times = Math.ceil(xp_diff / (act.experience.min));
                need_max_times = Math.ceil(xp_diff / (act.experience.max));
            }
        }

        let need = 0;
        if (need_min_times == need_max_times) {
            need = need_min_times;
        } else {
            need = need_max_times + '-' + need_min_times + ` (${(need_max_times + need_min_times)/2})`;
        }

        needt.innerHTML = need;

        // Сделать в tbl
        tbl.push([
            act.action,
            act.mob,
            need,
        ]);
    });
    return [getXp(current_lvl), getXp(target_lvl), tbl];
}