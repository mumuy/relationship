// 特征选项卡
(function(){
    let $mod_feature = document.querySelector('.mod-feature');
    let $nav = $mod_feature.querySelectorAll('.nav li');
    let $panels = $mod_feature.querySelectorAll('.panels .panel');
    let togglePanel = function(index = 0){
        $nav.forEach(function($li){
            $li.classList.remove('active');
        });
        $nav[index].classList.add('active');
        $panels.forEach(function($panel){
            $panel.classList.remove('active');
        });
        $panels[index].classList.add('active');
    };
    $nav.forEach(function($item,index){
        $item.addEventListener('click',function(){
            togglePanel(index);
        });
    });
    togglePanel(0);
})();