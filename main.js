function bookingHours(dataObject){
$(document).ready(function(){
    var weeks = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    var weeksDom = $('#weeksDom');
    var dataDom = $('#dataDom');
    var weeksHtml = '';

    function timer (weekIndex, rowIndex, id, data) {        
        var htmlDom = `<div class="bdb-select-from bdb-custom-select">
                            <label for="bdb-${id}-from">Time From</label>
                            <input type="time" data-key="${data.id}" name="bdb[${weekIndex}][${rowIndex}][start]" class="bdb-time-input bdb-${id}-start start" id="bdb-${id}-from" value="${data.start}">
                        </div>
                        <div class="bdb-select-from bdb-custom-select">
                            <label for="bdb-${id}-to">Time To</label>
                            <input type="time" data-key="${data.id}" name="bdb[${weekIndex}][${rowIndex}][close]" class="bdb-time-input bdb-${id}-close close" id="bdb-${id}-to" value="${data.close}">
                        </div>
                        <div class="bdb-select-from bdb-custom-select bdb-days-slots">
                            <label for="bdb-${id}-slots">Slots</label>
                            <input type="number" data-key="${data.id}" name="bdb[${weekIndex}][${rowIndex}][slots]" class="bdb-time-input bdb-${id}-slots slots" id="bdb-${id}-slots" value="${data.slots}">
                        </div>
                        <span data-id="${id}" class="${id}Remove dashicons dashicons-trash" title="Remove this item"></span>
                        <button data-id="${id}" data-key="${data.id}" class="bdb-remove" type="button">&times;</button>
                    `;            
        return htmlDom;
    }
    
    
    $(weeks).each(function(index, el) {        
        var activeWeek = index === 0 ? "'active'" : null;                
        weeksHtml += '<button class='+activeWeek+' data-id="'+el+'" data-key="'+index+'" type="button">'+el+'</button>';        
    });
    $(weeksDom).html(weeksHtml);

    function domManipulation(){
        var dataHtml = '<div>';
        $(weeks).each(function(key, id) { 
            var buttons = $('#weeksDom button');            
            var activeWeek = $(buttons[key]).hasClass('active') ? "active" : null; 
            dataHtml += `<div class="isNotVisible ${activeWeek}" id="${id}-${key}">
            ${             
                dataObject[key][id].map(function(data, ind) {                
                    return `<div class="bdb-select-hours bdb_${id}_section" id="${id}ID-${0}">
                        ${timer(key, ind, id, data)}
                    </div>`;
                }).join("")
            }               
            </div>`;
        });
        dataHtml += '</div>'
        

        $(dataDom).html(dataHtml);
    }
    
    $('#bhCopyTime').on('click', function(){
        var id = $('#weeksDom button.active').attr('data-id');
        var key = $('#weeksDom button.active').attr('data-key');        
        var array = JSON.parse(JSON.stringify(dataObject[key][id]));
        weeks.map((item, index) => {
            return dataObject[index][item] = [array.map(item => {
                return {start: item.start, close: item.close, slots: item.slots, id: item.id}
            })][0];
        });          
    });
                
    $('#weeksDom button').on('click', function(){
        var id = $(this).attr('data-id');
        var key = $(this).attr('data-key');
        $('#weeksDom button').removeClass('active');
        $('.bh-content').removeClass('active');
        
        $(id).addClass('active');
        $(this).addClass('active');
        
        domManipulation();
    });

    $('body').on('click', '.bdb-remove', function(){
        var id = $('#weeksDom button.active').attr('data-id');
        var key = $('#weeksDom button.active').attr('data-key');
        var keyDeleted = $(this).attr('data-key');        
        dataObject[key][id] = dataObject[key][id].filter(item => item.id !== parseInt(keyDeleted));        
        return domManipulation();        
    });

    $('body').on('keyup, change', '.start', function(){
        var id = $('#weeksDom button.active').attr('data-id');
        var key = $('#weeksDom button.active').attr('data-key');
        var keyUpdate = $(this).attr('data-key'); 
        dataObject[key][id].map(item => {
            if(item.id === keyUpdate){                
                return item.start = $(this).val();
            }
        });        
    });

    $('body').on('keyup, change', '.close', function(){
        var id = $('#weeksDom button.active').attr('data-id');
        var key = $('#weeksDom button.active').attr('data-key');
        var keyUpdate = $(this).attr('data-key'); 
        return dataObject[key][id].map(item => {
            if(item.id === keyUpdate){
                item.close = $(this).val();
            }
        });                
    });

    $('body').on('keyup', '.slots', function(){
        var id = $('#weeksDom button.active').attr('data-id');
        var key = $('#weeksDom button.active').attr('data-key');
        var keyUpdate = $(this).attr('data-key');
        
        dataObject[key][id].map(item => {
            if(item.id === keyUpdate){                
                return item.slots = $(this).val();
            }
        });        
    });

    $('#bhAddNew').on('click', function(){
        var id = $('#weeksDom button.active').attr('data-id');
        var key = $('#weeksDom button.active').attr('data-key');
        dataObject[key][id].push({start: "", close: "", slots: 1, id: id+"ID-"+dataObject[key][id].length});        
        return domManipulation();
    });
    return domManipulation();
});
}